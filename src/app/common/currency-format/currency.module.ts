import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { CurrencyDirective } from './currency.directive';

@NgModule({
  declarations: [CurrencyDirective],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    // BrowserModule,
    // BrowserAnimationsModule
  ],
  exports: [
    CurrencyDirective
  ],
  entryComponents : [
  ],
  providers: [
  ]
})
export class CurrencyDirectiveModule { }
