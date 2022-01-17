import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PanelModule } from 'primeng/panel';
import {BadgeModule} from 'primeng/badge';
import { EmpAttachFileComponent } from './emp-attach-file.component';
import { EditDetailModule } from 'src/app/common/edit-detail/edit-detail.module';
@NgModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      SharedModule,
      EditDetailModule,
      PanelModule,
      BadgeModule,
    ],
    
    declarations: [
      EmpAttachFileComponent
    ],
    exports: [EmpAttachFileComponent]
  })
  export class EmpAttachFileModule { }