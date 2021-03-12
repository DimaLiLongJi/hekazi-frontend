import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NZ_I18N, zh_CN, NZ_ICONS, } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { StatusPipe } from '../pipe/status.pipe';
import { PermissionTypePipe } from '../pipe/permissionType.pipe';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};

const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

registerLocaleData(zh);

const componentsAndPipes = [
  StatusPipe,
  PermissionTypePipe,
];

@NgModule({
  imports: [
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [
    ...componentsAndPipes,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NZ_ICONS, useValue: icons }
  ],
  exports: [
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    CommonModule,
    ...componentsAndPipes,
  ],
})
export class ShareModule { }
