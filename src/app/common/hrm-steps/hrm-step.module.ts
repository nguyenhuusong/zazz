import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { StepsModule } from 'primeng/steps';
import { HrmStepComponent } from './hrm-step.component';
@NgModule({
  declarations: [
    HrmStepComponent,
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    StepsModule,
  ],
  exports: [HrmStepComponent],
  entryComponents: [],
  providers: []
})
export class HrmStepModule { }
