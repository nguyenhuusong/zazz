import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListGridAngularModule } from 'src/app/common/list-grid-angular/list-grid-angular.module';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { EditDetailModule } from 'src/app/common/edit-detail/edit-detail.module';
import { FileUploadModule } from 'primeng/fileupload';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { SliderModule } from 'primeng/slider';
import { CurrencyFormatPipeModule } from 'src/app/common/pipe/currency-pipe.module';
import { DialogModule } from 'primeng/dialog';
import { AgGridModule } from '@ag-grid-community/angular';
import { ButtonRendererComponent } from 'src/app/utils/common/button-renderer.component';
import { ButtonRendererComponent1 } from 'src/app/utils/common/button-renderer.component-1';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CaiDatRoutingModule } from './cai-dat-routing.module';
import { PageNotifyModule } from 'src/app/components/page-notify/page-notify.module';
import { CaiDatLichHopComponent } from 'src/app/components/cai-dat-lich-hop/cai-dat-lich-hop.component';
import { CaiDatToChucComponent } from 'src/app/components/cai-dat-to-chuc/cai-dat-to-chuc.component';
import { CaiDatCongTyComponent } from 'src/app/components/cai-dat-cong-ty/cai-dat-cong-ty.component';
import { CaiDatNgayNghiLeComponent } from 'src/app/components/cai-dat-ngay-nghi-le/cai-dat-ngay-nghi-le.component';
import { ChiTietLichHopComponent } from 'src/app/components/cai-dat-lich-hop/chi-tiet-lich-hop/chi-tiet-lich-hop.component';
import { MeetingScheduleMemberComponent } from 'src/app/components/cai-dat-lich-hop/meeting-schedule-member/meeting-schedule-member.component';
import { DanhSachPhongHopComponent } from 'src/app/components/cai-dat-lich-hop/danh-sach-phong-hop/danh-sach-phong-hop.component';
import { ChiTietPhongHopComponent } from 'src/app/components/cai-dat-lich-hop/danh-sach-phong-hop/chi-tiet-phong-hop/chi-tiet-phong-hop.component';

@NgModule({
  imports: [
    MessagesModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TreeModule,
    TableModule,
    BreadcrumbModule,
    MultiSelectModule,
    ListGridAngularModule,
    ButtonModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    EditDetailModule,
    FileUploadModule,
    MenuModule,
    CardModule,
    BadgeModule,
    TooltipModule,
    SliderModule,
    SidebarModule,
    CaiDatRoutingModule,
    CurrencyFormatPipeModule,
    DialogModule,
    DropdownModule,
    PageNotifyModule,
    TabViewModule,
    PaginatorModule,
    ConfirmDialogModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1
    ]),
  ],

  declarations: [
    CaiDatLichHopComponent,
    CaiDatToChucComponent,
    CaiDatCongTyComponent,
    CaiDatNgayNghiLeComponent,
    ChiTietLichHopComponent,
    MeetingScheduleMemberComponent,
    DanhSachPhongHopComponent,
    ChiTietPhongHopComponent,
  ],
  providers: []
})
export class CaiDatModule { }