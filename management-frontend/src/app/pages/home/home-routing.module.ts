import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuardService } from '@/service/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'permission-list',
        loadChildren: () => import('../permission-list/permission-list.module').then(m => m.PermissionListModule)
      },
      {
        path: 'role-list',
        loadChildren: () => import('../role-list/role-list.module').then(m => m.RoleListModule)
      },
      {
        path: 'user-list',
        loadChildren: () => import('../user-list/user-list.module').then(m => m.UserListModule)
      },
      {
        path: 'self',
        loadChildren: () => import('../self/self.module').then(m => m.SelfModule)
      },
      {
        path: 'material',
        loadChildren: () => import('../material/material-list.module').then(m => m.PermissionListModule)
      },
      {
        path: 'qrcode',
        loadChildren: () => import('../qrcode-list/qrcode-list.module').then(m => m.QrcodeListModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
