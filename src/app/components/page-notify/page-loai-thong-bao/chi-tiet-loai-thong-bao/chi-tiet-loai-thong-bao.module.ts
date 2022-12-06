import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChiTietLoaiThongBaoComponent } from './chi-tiet-loai-thong-bao.component';
import { EditDetailModule } from 'src/app/common/edit-detail/edit-detail.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { HrmBreadCrumbModule } from 'src/app/common/hrm-breadcrumb/hrm-breadcrumb.module';
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
      BreadcrumbModule,
      HrmBreadCrumbModule,
    ],
    
    declarations: [
      ChiTietLoaiThongBaoComponent,
    ],
    exports: [ChiTietLoaiThongBaoComponent]
  })
  export class ChiTietLoaiThongBaoModule { }