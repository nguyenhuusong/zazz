import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HrmFilterCrumbComponent } from './hrm-filter.component';
@NgModule({
  declarations: [
    HrmFilterCrumbComponent,
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [HrmFilterCrumbComponent],
  entryComponents: [],
  providers: []
})
export class HrmBreadCrumbModule { }
