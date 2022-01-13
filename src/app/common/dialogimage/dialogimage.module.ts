import { DialogimageComponent } from './dialogimage.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    DialogimageComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  exports: [
    DialogimageComponent
  ],
  entryComponents: [],
  providers: []
})
export class DialogImageModule{ }
