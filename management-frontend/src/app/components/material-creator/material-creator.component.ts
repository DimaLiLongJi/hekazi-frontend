import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { File, IResponse } from '@/types';
import { MaterialService } from '@/service/material.service';
import { NzNotificationService, NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { API_URL } from '@/service/environment.service';

@Component({
  selector: 'app-material-creator',
  templateUrl: './material-creator.component.html',
})
export class MaterialCreatorComponent implements OnInit, OnDestroy {
  @Input() public modalVisible = false;
  @Output() private changeModal = new EventEmitter<boolean>();
  public validateForm: FormGroup;
  public isOkLoading = false;

  private createMaterila$: Subscription;


  public uploadFileList: {
    uid: number,      // 文件唯一标识
    name: string,   // 文件名
    status: 'done' | 'uploading' | 'error' | 'removed', // 状态有：uploading done error removed
    response?: IResponse<File>, // 服务端响应内容
    url: string, // 下载链接额外的 HTML 属性
  }[] = [];

  public fileId: number = null;

  constructor(
    private materialService: MaterialService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private fb: FormBuilder,
    @Inject(API_URL) public rootUrl: string,
  ) { }

  public ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      background: [null],
    });
    this.uploadFileList = [];
    this.fileId = null;
  }

  public ngOnDestroy() {
    if (this.createMaterila$) this.createMaterila$.unsubscribe();
  }

  public afterOpen() {
    this.validateForm.setValue({
      name: null,
      background: null,
    });
    this.validateForm.controls['name'].setValidators([Validators.required]);
    this.validateForm.controls['background'].setValidators(null);
    this.fileId = null;
    this.uploadFileList = [];
  }

  public afterClose() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      background: [null],
    });
    this.fileId = null;
    this.uploadFileList = [];
  }

  public handleCancel() {
    this.changeModal.emit(false);
    this.isOkLoading = false;
    this.validateForm.reset();
    this.fileId = null;
    this.uploadFileList = [];
  }

  public buildParams() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      this.notification.error('失败', '创建素材失败，请检查表单信息', {
        nzDuration: 2000,
      });
      return;
    }
    this.isOkLoading = true;
    return {
      name: this.validateForm.value['name'],
      background: this.validateForm.value['background'],
      file: this.fileId,
    };
  }

  public handleOnOk() {
    this.add();
  }

  public add() {
    const params = this.buildParams();
    if (!params) return;

    if (this.createMaterila$) this.createMaterila$.unsubscribe();
    this.createMaterila$ = this.materialService.create(params).subscribe(res => {
      this.isOkLoading = false;
      if (res.success) {
        this.changeModal.emit(false);
        this.validateForm.reset();
        this.uploadFileList = [];
        this.fileId = null;
        this.notification.success('成功', '创建素材成功', {
          nzDuration: 2000,
        });
      } else {
        this.notification.error('失败', `创建素材失败，原因：${res.message}`, {
          nzDuration: 2000,
        });
      }
    });
  }

  public upload(param: UploadChangeParam) {
    if (param.type === 'success') {
      const file: File = param.file.response.data;
      const findFile = this.uploadFileList.find(uploadFile => uploadFile.response && uploadFile.response.data && uploadFile.response.data.id === file.id);
      if (findFile) findFile.url = `${this.rootUrl}/static/${file.name}`;
      this.fileId = file.id;
    }
    if (param.type === 'removed') {
      const file: File = param.file.response.data;
      if (this.fileId === file.id) this.fileId = null;
    }
  }
}
