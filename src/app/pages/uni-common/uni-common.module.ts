import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';
import { UniCommonRoutingModule } from './uni-common-routing.module';
import { UniCommonComponent } from 'src/app/components/uni-common/uni-common.component';
import { UniIconModule } from 'src/app/common/uni-icon/uni-icon.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TabViewModule,
    UniCommonRoutingModule,
    UniIconModule,
  ],
  declarations: [
    UniCommonComponent
  ],
  providers: [ ]
})
export class UniCommonModule { }