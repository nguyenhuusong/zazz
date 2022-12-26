import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { HrmSearchCustomerComponent } from './hrm-search-customer.component';
@NgModule({
  declarations: [
    HrmSearchCustomerComponent,
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
  exports: [HrmSearchCustomerComponent],
  entryComponents: [],
  providers: []
})
export class HrmSearchCustomerModule { }
