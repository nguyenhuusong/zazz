import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { HrmSearchEmpComponent } from './hrm-search-emp.component';
@NgModule({
  declarations: [
    HrmSearchEmpComponent,
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [HrmSearchEmpComponent],
  entryComponents: [],
  providers: []
})
export class HrmSearchEmpModule { }
