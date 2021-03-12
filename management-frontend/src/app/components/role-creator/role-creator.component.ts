import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionDetail } from '@/types';
import { RoleService } from '@/service/role.service';
import { PermissionService } from '@/service/permission.service';
import { NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-creator',
  templateUrl: './role-creator.component.html',
})
export class RoleCreatorComponent implements OnInit, OnDestroy {
  @Input() public roleId: number;
  @Input() public modalVisible = false;
  @Output() private changeModal = new EventEmitter<boolean>();
  public validateForm: FormGroup;
  public isOkLoading = false;

  private createRole$: Subscription;
  private getPermissionList$: Subscription;
  private updateRole$: Subscription;
  private getRoleById$: Subscription;

  public permissionList: PermissionDetail[];
  public showRoute = true;
  public modalTitle = '新增角色';


  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private fb: FormBuilder,
  ) { }

  public ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      permissionIds: [null],
    });
  }

  public ngOnDestroy() {
    if (this.getPermissionList$) this.getPermissionList$.unsubscribe();
    if (this.createRole$) this.createRole$.unsubscribe();
    if (this.updateRole$) this.updateRole$.unsubscribe();
    if (this.getRoleById$) this.getRoleById$.unsubscribe();
  }

  public afterOpen() {
    this.getPermissionList();
    if (this.roleId) {
      this.modalTitle = '编辑角色';
      this.getRoleById(this.roleId);
    } else {
      this.modalTitle = '新增角色';
      this.validateForm.setValue({
        name: null,
        permissionIds: null,
      });
      this.validateForm.controls['name'].setValidators([Validators.required]);
      this.validateForm.controls['permissionIds'].setValidators(null);
    }
  }

  public afterClose() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      permissionIds: [null],
    });
  }

  public getRoleById(id: number) {
    if (this.getRoleById$) this.getRoleById$.unsubscribe();
    this.getRoleById$ = this.roleService.getById(id).subscribe(res => {
      if (res.success) {
        const permissionIds = res.data.permissionList ? res.data.permissionList.map(permission => permission.id) : [];
        this.validateForm.setValue({
          name: res.data.name,
          permissionIds,
        });
        this.validateForm.controls['name'].setValidators([Validators.required]);
        this.validateForm.controls['permissionIds'].setValidators(null);
      } else {
        this.message.error('获取角色详情失败');
      }
    });
  }

  public handleCancel() {
    this.changeModal.emit(false);
    this.isOkLoading = false;
    this.validateForm.reset();
    this.getPermissionList();
  }

  public buildParams() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      this.notification.error('失败', `${this.roleId ? '修改' : '创建'}角色失败，请检查表单信息`, {
        nzDuration: 2000,
      });
      return;
    }
    this.isOkLoading = true;
    return {
      name: this.validateForm.value['name'],
      permissionIds: this.validateForm.value['permissionIds'],
    };
  }

  public handleOnOk() {
    if (this.roleId) this.updateRole();
    else this.addRole();
  }

  public addRole() {
    const params = this.buildParams();
    if (!params) return;

    if (this.createRole$) this.createRole$.unsubscribe();
    this.createRole$ = this.roleService.createRole(params).subscribe(res => {
      this.isOkLoading = false;
      if (res.success) {
        this.changeModal.emit(false);
        this.validateForm.reset();
        this.notification.success('成功', '创建角色成功', {
          nzDuration: 2000,
        });
      } else {
        this.notification.error('失败', `创建角色失败，原因：${res.message}`, {
          nzDuration: 2000,
        });
      }
    });
  }

  public updateRole() {
    const params = this.buildParams();
    if (!params) return;

    if (this.updateRole$) this.updateRole$.unsubscribe();
    this.updateRole$ = this.roleService.updateRole(this.roleId, params).subscribe(res => {
      this.isOkLoading = false;
      if (res.success) {
        this.changeModal.emit(false);
        this.validateForm.reset();
        this.notification.success('成功', '更新角色成功', {
          nzDuration: 2000,
        });
      } else {
        this.notification.error('失败', `更新角色失败，原因：${res.message}`, {
          nzDuration: 2000,
        });
      }
    });
  }

  public getPermissionList() {
    if (this.getPermissionList$) this.getPermissionList$.unsubscribe();
    this.getPermissionList$ = this.permissionService.getPermissionList().subscribe(res => {
      if (res.success) this.permissionList = res.data[0];
      else this.message.error('获取权限列表失败');
    });
  }
}
