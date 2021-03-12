import { NgModule } from '@angular/core';
import { MaterialListComponent } from './material-list.component';
import { MaterialCreatorComponent } from '@/components/material-creator/material-creator.component';
import { MaterialEditorComponent } from '@/components/material-editor/material-editor.component';
import { ShareModule } from '@/module/share.module';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    ShareModule,
    RouterModule.forChild([
      {
        path: '',
        component: MaterialListComponent,
      }
    ])
  ],
  declarations: [
    MaterialEditorComponent,
    MaterialCreatorComponent,
    MaterialListComponent,
  ],
})
export class PermissionListModule { }
