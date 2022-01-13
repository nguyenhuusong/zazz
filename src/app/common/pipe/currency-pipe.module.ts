import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { CurrencyFormatPipe } from './currency-format.pipe';

@NgModule({
  declarations: [CurrencyFormatPipe],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    // BrowserModule,
    // BrowserAnimationsModule
  ],
  exports: [
    CurrencyFormatPipe
  ],
  entryComponents : [
  ],
  providers: [
  ]
})
export class CurrencyFormatPipeModule { }
