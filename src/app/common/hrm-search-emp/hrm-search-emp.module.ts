import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { HrmSearchEmpComponent } from './hrm-search-emp.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
@NgModule({
  declarations: [
    HrmSearchEmpComponent,
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    AutoCompleteModule,
    ButtonModule,
    ImageModule
  ],
  exports: [HrmSearchEmpComponent],
  entryComponents: [],
  providers: []
})
export class HrmSearchEmpModule { }
