import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { DialogModule } from 'primeng/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditDetailComponent } from './edit-detail.component';
import { ButtonModule } from 'primeng/button';
import { ConfigGridTableFormModule } from '../config-grid-table-form/config-grid-table-form.module';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    FormlyModule,
    FormlyModule.forRoot(),
    ButtonModule,
    ConfigGridTableFormModule,
    DialogModule
  ],

  declarations: [
    EditDetailComponent
  ],
  exports: [
    EditDetailComponent
  ],

})
export class EditDetailModule { }