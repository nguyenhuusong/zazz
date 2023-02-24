import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UniIconComponent } from './uni-icon.component';
import { UniIconsSvgComponent } from './uni-icons-svg/uni-icons-svg.component';
@NgModule({
  declarations: [
    UniIconComponent,
    UniIconsSvgComponent
   ],
  imports: [
    CommonModule,
  ],
  exports: [
    UniIconComponent,
    UniIconsSvgComponent
  ],
  entryComponents: [],
  providers: []
})
export class UniIconModule { }
