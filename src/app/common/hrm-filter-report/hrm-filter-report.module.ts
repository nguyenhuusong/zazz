import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HrmFilterReportComponent } from './hrm-filter-report.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TreeSelectModule } from 'primeng/treeselect';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    HrmFilterReportComponent,
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AutoCompleteModule,
    TreeSelectModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule
  ],
  exports: [HrmFilterReportComponent],
  entryComponents: [],
  providers: []
})
export class HrmFilterReportModule { }
