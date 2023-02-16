import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ImportExcelComponent } from './import-excel.component';
import { ListGridAngularModule } from '../list-grid-angular/list-grid-angular.module';
import { FileUploadModule } from 'primeng/fileupload';
import { HrmBreadCrumbModule } from '../hrm-breadcrumb/hrm-breadcrumb.module';
@NgModule({
  declarations: [
    ImportExcelComponent,
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    AutoCompleteModule,
    ButtonModule,
    ImageModule,
    BreadcrumbModule,
    ListGridAngularModule,
    FileUploadModule,
    HrmBreadCrumbModule
  ],
  exports: [ImportExcelComponent],
  entryComponents: [],
  providers: []
})
export class ImportExcelModule { }
