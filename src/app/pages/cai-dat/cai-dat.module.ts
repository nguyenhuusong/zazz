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
import { TreeSelectModule } from 'primeng/treeselect';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { ChiTietToChucComponent } from 'src/app/components/cai-dat-to-chuc/chi-tiet-to-chuc/chi-tiet-to-chuc.component';
import { GridAddModule } from 'src/app/common/grid-add/grid-add.module';
import { PanelModule } from 'primeng/panel';
import { ChucVuComponent } from 'src/app/components/cai-dat-to-chuc/chuc-vu/chuc-vu.component';
import { NoiLamViecComponent } from 'src/app/components/cai-dat-to-chuc/noi-lam-viec/noi-lam-viec.component';
import { CaiDatThamSoComponent } from 'src/app/components/cai-dat-to-chuc/cai-dat-tham-so/cai-dat-tham-so.component';
import { LichLamViecComponent } from 'src/app/components/cai-dat-to-chuc/lich-lam-viec/lich-lam-viec.component';
import { ChiTietChucVuComponent } from 'src/app/components/cai-dat-to-chuc/chuc-vu/chi-tiet-chuc-vu/chi-tiet-chuc-vu.component';
import { ChiTietNoiLamViecComponent } from 'src/app/components/cai-dat-to-chuc/noi-lam-viec/chi-tiet-noi-lam-viec/chi-tiet-noi-lam-viec.component';
import { ChiTietLichLamViecComponent } from 'src/app/components/cai-dat-to-chuc/lich-lam-viec/chi-tiet-lich-lam-viec/chi-tiet-lich-lam-viec.component';
import { CommonSearchUserMasterModule } from 'src/app/common/search-user-master/search-user-master.module';
import { ChiTietCongTyComponent } from 'src/app/components/cai-dat-cong-ty/chi-tiet-cong-ty/chi-tiet-cong-ty.component';
import { QuanLyHopDongComponent } from 'src/app/components/quan-ly-hop-dong/quan-ly-hop-dong.component';
import { ChiTietHopDongComponent } from 'src/app/components/quan-ly-hop-dong/chi-tiet-hop-dong/chi-tiet-hop-dong.component';
import { ThamSoChungDetailComponent } from 'src/app/components/cai-dat-to-chuc/tham-so-chung/tham-so-chung-detail/tham-so-chung-detail.component';
import { ThamSoChungListComponent } from 'src/app/components/cai-dat-to-chuc/tham-so-chung/tham-so-chung-list/tham-so-chung-list.component';
import { LyDoNghiViecComponent } from 'src/app/components/ly-do-nghi-viec/ly-do-nghi-viec.component';
import { ChiTietLyDoNghiViecComponent } from 'src/app/components/ly-do-nghi-viec/chi-tiet-ly-do-nghi-viec/chi-tiet-ly-do-nghi-viec.component';
import { CaiDatPhongHopTheoTangComponent } from 'src/app/components/cai-dat-phong-hop-theo-tang/cai-dat-phong-hop-theo-tang.component';
import { ChiTietPhongHopTheoTangComponent } from 'src/app/components/cai-dat-phong-hop-theo-tang/chi-tiet-phong-hop-theo-tang/chi-tiet-phong-hop-theo-tang.component';
import { QuanLyNgayNghiComponent } from 'src/app/components/quan-ly-ngay-nghi/quan-ly-ngay-nghi.component';
import { HrmBreadCrumbModule } from 'src/app/common/hrm-breadcrumb/hrm-breadcrumb.module';

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
    OrganizationChartModule,
    TreeSelectModule,
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
    GridAddModule,
    PanelModule,
    HrmBreadCrumbModule,
    CommonSearchUserMasterModule,
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
    ChiTietToChucComponent,
    ChucVuComponent,
    NoiLamViecComponent,
    CaiDatThamSoComponent,
    LichLamViecComponent,
    ChiTietChucVuComponent,
    ChiTietNoiLamViecComponent,
    ChiTietLichLamViecComponent,
    ChiTietCongTyComponent,
    QuanLyHopDongComponent,
    ChiTietHopDongComponent,
    ThamSoChungListComponent,
    ThamSoChungDetailComponent,
    LyDoNghiViecComponent,
    ChiTietLyDoNghiViecComponent,
    CaiDatPhongHopTheoTangComponent,
    ChiTietPhongHopTheoTangComponent,
    QuanLyNgayNghiComponent
  ],
  providers: []
})
export class CaiDatModule { }