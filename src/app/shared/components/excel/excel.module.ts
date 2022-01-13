import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ExcelComponent} from './excel.component';
import { AgGridModule } from '@ag-grid-community/angular';
@NgModule({
  declarations: [ExcelComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        AgGridModule
    ],
  exports: [
    ExcelComponent
  ],
  entryComponents : [
    ExcelComponent
  ],
  providers: [
  ]
})
export class ExcelModule { }
