import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { MaterialDetail } from '@/types/material';
import { MaterialService } from '@/service/material.service';
import { QrcodeService } from '@/service/qrcode.service';

@Component({
  selector: 'app-qrcode-creator',
  templateUrl: './qrcode-creator.component.html',
})
export class QrcodeCreatorComponent implements OnInit, OnDestroy {
  @Input() public qrcodeId: number;
  @Input() public modalVisible = false;
  @Output() private changeModal = new EventEmitter<boolean>();

  public isOkLoading = false;

  // 整个类型表单
  public validateForm: FormGroup;
  // 筛选需求状态列表
  public qrcodeMaterials: FormArray = null;

  private createQrcode$: Subscription;
  private updateQrcode$: Subscription;
  private getMaterialList$: Subscription;
  private getQrcodeById$: Subscription;

  public modalTitle = '新增二维码页面';
  public materialList: MaterialDetail[];

  constructor(
    private materialService: MaterialService,
    private service: QrcodeService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private fb: FormBuilder,
  ) { }
  

  public ngOnInit() {
    this.qrcodeMaterials = this.fb.array([this.fb.group({
      qrcode: this.fb.control(this.qrcodeId),
      probability: this.fb.control(null),
      material: this.fb.control(null),
    })]);
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      qrcodeMaterialList: this.qrcodeMaterials,
    });
    this.getMaterialList();
    console.log(44223, (this.validateForm.controls['qrcodeMaterialList'] as FormArray).controls);
  }

  public ngOnDestroy() {
    if (this.getMaterialList$) this.getMaterialList$.unsubscribe();
    if (this.createQrcode$) this.createQrcode$.unsubscribe();
    if (this.updateQrcode$) this.updateQrcode$.unsubscribe();
    if (this.getQrcodeById$) this.getQrcodeById$.unsubscribe();
  }

  public afterOpen() {
    if (this.qrcodeId) {
      this.modalTitle = '编辑二维码页面';
      this.getQrcodeById(this.qrcodeId);
    } else {
      this.validateForm.controls['name'].setValue(null);
      this.validateForm.controls['name'].setValidators([Validators.required]);
      this.qrcodeMaterials = this.fb.array([this.fb.group({
        qrcode: this.fb.control(this.qrcodeId),
        probability: this.fb.control(null),
        material: this.fb.control(null),
      })]);
      console.log(4444, this.validateForm.controls['qrcodeMaterialList']);
      this.validateForm.controls['qrcodeMaterialList']= this.qrcodeMaterials;
    }
  }

  /**
   * 关闭modal之后清除掉
   *
   * @memberof DemandTypeCreatorComponent
   */
  public afterClose() {
    this.qrcodeMaterials = this.fb.array([this.fb.group({
      qrcode: this.fb.control(this.qrcodeId),
      probability: this.fb.control(null),
      material: this.fb.control(null),
    })]);
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      qrcodeMaterialList: this.qrcodeMaterials,
    });
  }

  public getQrcodeById(id: number) {
    if (this.getQrcodeById$) this.getQrcodeById$.unsubscribe();
    this.getQrcodeById$ = this.service.getById(id).subscribe(res => {
      if (res.success) {
        this.validateForm.controls['name'].setValue(res.data.name);
        this.validateForm.controls['name'].setValidators([Validators.required]);
        this.qrcodeMaterials = this.fb.array([]);
        if (res.data.qrcodeMaterialList && res.data.qrcodeMaterialList.length > 0) {
          res.data.qrcodeMaterialList.forEach(qrcodeMaterial => {
            this.qrcodeMaterials.push(this.fb.group({
              qrcode: this.fb.control(this.qrcodeId),
              probability: this.fb.control(qrcodeMaterial.probability),
              material: this.fb.control(qrcodeMaterial.material.id),
            }));
          });
        } else {
          this.qrcodeMaterials.push(this.fb.group({
            qrcode: this.fb.control(this.qrcodeId),
            probability: this.fb.control(null),
            material: this.fb.control(null),
          }));
        }
        this.validateForm.controls['qrcodeMaterialList']= this.qrcodeMaterials;
      } else {
        this.message.error('获取二维码页面失败');
      }
    });
  }

  public handleCancel() {
    this.changeModal.emit(false);
    this.isOkLoading = false;
    this.validateForm.reset();
  }

  public buildParams() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      this.notification.error('失败', `${this.qrcodeId ? '修改' : '创建'}需求类型失败，请检查表单信息`, {
        nzDuration: 2000,
      });
      return;
    }
    this.isOkLoading = true;
    const qrcodeMaterialList = [];
    console.log(23123, this.qrcodeMaterials.controls);
    this.qrcodeMaterials.controls.forEach((qrcodeMaterial: FormGroup) => {
      console.log(2312312312, qrcodeMaterial);
        qrcodeMaterialList.push({
        qrcode: this.qrcodeId,
        probability: qrcodeMaterial.value['probability'],
        material: qrcodeMaterial.value['material'],
      });
    });
    console.log(2312313, qrcodeMaterialList);
    return {
      name: this.validateForm.value['name'],
      qrcodeMaterialList,
    };
  }

  public handleOnOk() {
    if (this.qrcodeId) this.updateQrcode();
    else this.addQrcode();
  }

  public addQrcode() {
    const params = this.buildParams();
    if (!params) return;

    if (this.createQrcode$) this.createQrcode$.unsubscribe();
    this.createQrcode$ = this.service.create(params).subscribe(res => {
      this.isOkLoading = false;
      if (res.success) {
        if (this.createQrcode$) this.createQrcode$.unsubscribe();
        this.changeModal.emit(false);
        this.validateForm.reset();
        this.notification.success('成功', '创建二维码页面成功', {
          nzDuration: 2000,
        });
      } else {
        this.notification.error('失败', `创建二维码页面失败，原因：${res.message}`, {
          nzDuration: 2000,
        });
      }
    });
  }

  public updateQrcode() {
    const params = this.buildParams();
    if (!params) return;

    if (this.updateQrcode$) this.updateQrcode$.unsubscribe();
    this.updateQrcode$ = this.service.update(this.qrcodeId, params).subscribe(res => {
      this.isOkLoading = false;
      if (res.success) {
        if (this.updateQrcode$) this.updateQrcode$.unsubscribe();
        this.changeModal.emit(false);
        this.validateForm.reset();
        this.notification.success('成功', '更新二维码页面成功', {
          nzDuration: 2000,
        });
      } else {
        this.notification.error('失败', `更新二维码页面失败，原因：${res.message}`, {
          nzDuration: 2000,
        });
      }
    });
  }

  public addQrcodeMaterial() {
    this.qrcodeMaterials.push(this.fb.group({
      qrcode: this.fb.control(this.qrcodeId),
      probability: this.fb.control(null),
      material: this.fb.control(null),
    }));
    this.validateForm.controls['qrcodeMaterialList']= this.qrcodeMaterials;
  }


  public deleteQrcodeMaterial(index: number) {
    if (index !== -1 && this.qrcodeMaterials.controls.length > 1) {
      this.qrcodeMaterials.removeAt(index);
    }
  }


  public getMaterialList() {
    if (this.getMaterialList$) this.getMaterialList$.unsubscribe();
    this.getMaterialList$ = this.materialService.getList().subscribe(res => {
      if (res.success) this.materialList = res.data[0] || [];
      else this.message.error('获取素材列表失败');
      console.log(2313, this.materialList);
    });
  }
}
