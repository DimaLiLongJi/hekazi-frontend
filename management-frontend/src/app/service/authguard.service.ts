import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ModuleDetail, PermissionDetail } from '@/types';
import { setPermissionList, setNotification } from '@/decorators/has-permission';
import { AuthService } from './auth.service';
import { SpinControllerService } from './spin.controller.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  private getSelf$: Subscription;
  public permissionList$: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService,
    public spinControllerService: SpinControllerService,
  ) { }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    this.spinControllerService.update(true);
    return new Promise((resolve) => {
      if (this.getSelf$) this.getSelf$.unsubscribe();
      this.getSelf$ = this.authService.getSelf().subscribe(res => {
        if (res.success && res.data) {
          const moduleList: ModuleDetail[] = [];
          const permissionList: PermissionDetail[] = [];
          this.authService.self = res.data;
          res.data.permissionList.forEach(permission => {
            if (!permissionList.find(per => per.id === permission.id) && !permission.deleteDate) {
              permissionList.push(permission);
            }
          });
          if (res.data.role && res.data.role.permissionList) {
            res.data.role.permissionList.forEach(permission => {
              if (!permissionList.find(per => per.id === permission.id) && !permission.deleteDate) {
                permissionList.push(permission);
              }
            });
          }
          permissionList.forEach(permission => {
            if (!permission.module) return;
            if (!moduleList.find(mod => mod.id === permission.module.id && !permission.module.deleteDate)) {
              moduleList.push({ ...permission.module, permissionList: [] });
            }
          });
          permissionList.forEach(permission => {
            if (!permission.module) return;
            moduleList.forEach(mod => {
              if (!mod.permissionList.find(per => permission.id === per.id)) {
                if (permission.module.id === mod.id) mod.permissionList.push(permission);
              }
            });
          });
          console.log(11111, '????????????', res.data);
          console.log(22222, '????????????', permissionList);
          console.log(33333, '????????????', moduleList);
          // ??????????????????????????????
          setPermissionList(permissionList);
          setNotification(this.notification);
          this.authService.permissionList$.next(permissionList);
          this.authService.moduleList$.next(moduleList);

          this.spinControllerService.update(false);

          resolve(true);
        } else {
          this.notification.error('????????????', `???????????????3??????????????????????????????????????????${res.data}`, {
            nzDuration: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/login']).then(() => {
              this.spinControllerService.update(false);
            });
            resolve(false);
          }, 3000);
        }
      });
    });
  }

  public canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    this.spinControllerService.update(true);
    return new Promise((resolve) => {
      if (this.permissionList$) this.permissionList$.unsubscribe();
      this.permissionList$ = this.authService.permissionList$.subscribe(permissionList => {
        if (permissionList) {
          const url = state.url.split('?')[0];
          const findPermission = permissionList.find(permission => permission.route === url);
          if (findPermission) {
            this.spinControllerService.update(false);
            resolve(true);
          } else {
            this.notification.error('????????????', `????????????${url}??????????????????????????????????????????`, {
              nzDuration: 2000,
            });
            this.router.navigate(['/login']);
            this.spinControllerService.update(false);
            resolve(true);
          }
        } else {
          this.spinControllerService.update(false);
          this.notification.error('????????????', `???????????????????????????????????????????????????`, {
            nzDuration: 2000,
          });
          resolve(false);
        }
      });
    });
  }
}
