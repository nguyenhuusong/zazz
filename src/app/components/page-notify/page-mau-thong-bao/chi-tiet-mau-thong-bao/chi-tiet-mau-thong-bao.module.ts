import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChiTietMauThongBaoComponent } from './chi-tiet-mau-thong-bao.component';
import { EditDetailModule } from 'src/app/common/edit-detail/edit-detail.module';
@NgModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      SharedModule,
      DialogModule,
      CalendarModule,
      TabViewModule,
      CardModule,
      EditDetailModule,
      SelectButtonModule,
    
    ],
    
    declarations: [
      ChiTietMauThongBaoComponent,
    ],
    exports: [ChiTietMauThongBaoComponent]
  })
  export class ChiTietMauThongBaoBaoModule { }