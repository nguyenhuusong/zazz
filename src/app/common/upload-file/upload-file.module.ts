import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { UploadFileComponent } from './upload-file.component';
import {FileUploadModule} from 'primeng/fileupload';
import {ImageModule} from 'primeng/image';
import { AgGridModule } from '@ag-grid-community/angular';
@NgModule({
  declarations: [
    UploadFileComponent
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AgGridModule,
    SharedModule,
    ButtonModule,
    DialogModule,
    TabViewModule,
    FileUploadModule,
    ImageModule
    ],
  exports: [UploadFileComponent],
  entryComponents: [],
  providers: []
})
export class UploadFileModule { }
