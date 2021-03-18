import { NgModule } from '@angular/core';
import { QrcodeListComponent } from './qrcode-list.component';
import { ShareModule } from '@/module/share.module';
import { RouterModule } from '@angular/router';
import { QrcodeCreatorComponent } from '@/components/qrcode-creator/qrcode-creator.component';


@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild([
      {
        path: '',
        component: QrcodeListComponent,
      }
    ])
  ],
  declarations: [
    QrcodeCreatorComponent,
    QrcodeListComponent,
  ],
})
export class QrcodeListModule { }
