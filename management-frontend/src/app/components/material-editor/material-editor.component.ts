import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { File, IResponse } from '@/types';
import { NzNotificationService, NzMessageService, UploadChangeParam, UploadFile, NzModalService } from 'ng-zorro-antd';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '@/service/environment.service';
import { MaterialService } from '@/service/material.service';
import { MaterialDetail } from '@/types/material';


@Component({
  selector: 'app-material-editor',
  templateUrl: './material-editor.component.html',
})
export class MaterialEditorComponent implements OnInit, OnDestroy {
  @Input() public materialId: number;
  @Input() public modalVisible = false;
  @Output() private changeModal = new EventEmitter<boolean>();
  public validateForm: FormGroup;

  private getById$: Subscription;
  private updateMaterial$: Subscription;

  public creatorId: number;

  public changeControll = {
    name: false,
    background: false,
  };

  public uploadFileList: {
    uid: number,      // 文件唯一标识
    name: string,   // 文件名
    status: 'done' | 'uploading' | 'error' | 'removed', // 状态有：uploading done error removed
    response?: IResponse<File>, // 服务端响应内容
    url: string, // 下载链接额外的 HTML 属性
  }[] = [];

  public fileId: number = null;

  public matetrialDetail: MaterialDetail;

  constructor(
    private materialService: MaterialService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    @Inject(API_URL) public rootUrl: string,
  ) {
  }

  public ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      background: [null],
    });
    this.validateForm.disable();
    this.uploadFileList = [];
    this.fileId = null;
  }

  public ngOnDestroy() {
    if (this.getById$) this.getById$.unsubscribe();
    if (this.updateMaterial$) this.updateMaterial$.unsubscribe();
  }

  public afterOpen() {
    this.uploadFileList = [];
    this.fileId = null;
    this.validateForm.disable();
    this.getById(this.materialId);
  }

  public afterClose() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      background: [null],
    });
  }

  public handleCancel() {
    this.changeModal.emit(false);
    this.validateForm.reset();
    this.uploadFileList = [];
    this.fileId = null;
    this.changeControll = {
      name: false,
      background: false,
    };
  }

  public getById(id: number) {
    if (this.getById$) this.getById$.unsubscribe();
    this.getById$ = this.materialService.getById(id).subscribe(res => {
      if (!res.success) {
        this.notification.error('获取素材信息失败', res.message, {
          nzDuration: 4000,
        });
        return;
      }
      this.matetrialDetail = res.data;
      const data = res.data;

      this.creatorId = data.creator.id;

      this.uploadFileList = data.file ? [{
        uid: data.file.id,
        name: data.file.name,
        status: 'done',
        url: `${this.rootUrl}/static/${data.file.name}`,
      }] : [];


      this.validateForm.setValue({
        name: data.name,
        background: data.background,
      });
      this.validateForm.controls['name'].setValidators([Validators.required]);
      this.validateForm.controls['background'].setValidators(null);
    });
  }

  public change(type: string) {
    this.changeControll[type] = true;
    this.validateForm.controls[type].enable();
  }

  public confirm(type: string) {
    this.changeDemandDetail(type);
  }

  public changeDemandDetail(type: string) {
    if (this.updateMaterial$) this.updateMaterial$.unsubscribe();
    this.validateForm.controls[type].markAsDirty();
    this.validateForm.controls[type].updateValueAndValidity();
    const params = { [type]: this.validateForm.value[type] };
    this.updateMaterial$ = this.materialService.update(this.materialId, params).subscribe(res => {
      if (res.success) {
        this.changeControll[type] = false;
        this.validateForm.controls[type].disable();
        this.getById(this.materialId);
        this.notification.success('成功', '更新素材成功', {
          nzDuration: 2000,
        });
      }
    });
  }

  public upload(param: UploadChangeParam) {
    if (param.type === 'success') {
      const file: File = param.file.response.data;
      const findFile = this.uploadFileList.find(uploadFile => uploadFile.response && uploadFile.response.data && uploadFile.response.data.id === file.id);
      if (findFile) {
        findFile.url = `${this.rootUrl}/static/${file.name}`;
        findFile.uid = file.id;
      }
      if (this.fileId !== findFile.uid) this.fileId = findFile.uid
    }
    if (param.type === 'removed') {
      const file: File = param.file.response ? param.file.response.data : param.file;
      if (this.fileId === file.id) this.fileId = null;
    }
  }

  public removeFile = (file: UploadFile): boolean | Observable<boolean> => {
    if (file.status === 'removed') {
      return this.materialService.removeFile({
        materialId: this.materialId,
        fileId: Number(file.uid)
      }).pipe(map(res$ => res$.success));
    } else return false;
  }
}
