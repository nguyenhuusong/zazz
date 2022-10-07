import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { CheckHideActionsDirective } from './check-action.directive';
@NgModule({
  declarations: [CheckHideActionsDirective],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    // BrowserModule,
    // BrowserAnimationsModule
  ],
  exports: [
    CheckHideActionsDirective
  ],
  entryComponents : [
  ],
  providers: [
  ]
})
export class CheckHideActionsDirectiveModule { }
