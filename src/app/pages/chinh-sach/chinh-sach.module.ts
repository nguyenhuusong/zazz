import { OrganizationChartModule } from 'primeng/organizationchart';
import { BieuMauComponent } from './../../components/bieu-mau/bieu-mau.component';
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
import { ChinhSachRoutingModule } from './chinh-sach-routing.module';
import { CsChamCongComponent } from 'src/app/components/cs-cham-cong/cs-cham-cong.component';
import { CsNghiPhepComponent } from 'src/app/components/cs-nghi-phep/cs-nghi-phep.component';
import { CsAnCaComponent } from 'src/app/components/cs-an-ca/cs-an-ca.component';
import { CsTienLuongComponent } from 'src/app/components/cs-tien-luong/cs-tien-luong.component';
import { CsThueThuNhapComponent } from 'src/app/components/cs-thue-thu-nhap/cs-thue-thu-nhap.component';
import { ChiTietNghiPhepComponent } from 'src/app/components/cs-nghi-phep/chi-tiet-nghi-phep/chi-tiet-nghi-phep.component';
import { ChiTietAnCaComponent } from 'src/app/components/cs-an-ca/chi-tiet-an-ca/chi-tiet-an-ca.component';
import { ChiTietChamCongComponent } from 'src/app/components/cs-cham-cong/chi-tiet-cham-cong/chi-tiet-cham-cong.component';
import { ChiTietTienLuongComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/chi-tiet-tien-luong.component';
import { ImportExcelComponent } from 'src/app/components/cs-thue-thu-nhap/import-excel/import-excel.component';
import { DeleteTaxComponent } from 'src/app/components/cs-thue-thu-nhap/delete-tax/delete-tax.component';
import { ChiTietThueThuNhapComponent } from 'src/app/components/cs-thue-thu-nhap/chi-tiet-thue-thu-nhap/chi-tiet-thue-thu-nhap.component';
import { PhepNamComponent } from 'src/app/components/phep-nam/phep-nam.component';
import { PhepBuComponent } from 'src/app/components/phep-bu/phep-bu.component';
import { ChiTietPhepBuComponent } from 'src/app/components/phep-bu/chi-tiet-phep-bu/chi-tiet-phep-bu.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TreeSelectModule } from 'primeng/treeselect';
import { HrmBreadCrumbModule } from 'src/app/common/hrm-breadcrumb/hrm-breadcrumb.module';
import { CheckboxModule } from 'primeng/checkbox';
import { BieuMauChiTietComponent } from 'src/app/components/bieu-mau/bieu-mau-chi-tiet/bieu-mau-chi-tiet.component';
import { LoaiBieuMauComponent } from 'src/app/components/bieu-mau/loai-bieu-mau/loai-bieu-mau.component';
import { ChiTietLoaiBieuMauComponent } from 'src/app/components/bieu-mau/loai-bieu-mau/chi-tiet-loai-bieu-mau/chi-tiet-loai-bieu-mau.component';
import { ConfigGridTableFormModule } from 'src/app/common/config-grid-table-form/config-grid-table-form.module';
import { XemCongComponent } from 'src/app/components/cs-cham-cong/xem-cong/xem-cong.component';
import { CheckHideActionsDirectiveModule } from 'src/app/directive/check-action.module';
import { EatingListComponent } from 'src/app/components/cs-an-ca/eating-list/eating-list.component';
import { ImportPhepBuComponent } from 'src/app/components/phep-bu/import-phep-bu/import-phep-bu.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FormFilterModule } from 'src/app/common/form-filter/form-filter.module';
import { HrmSearchEmpModule } from 'src/app/common/hrm-search-emp/hrm-search-emp.module';
import { CsChamCongOverviewComponent } from 'src/app/components/cs-cham-cong/cs-cham-cong-overview/cs-cham-cong-overview.component';
import { PanelModule } from 'primeng/panel';
import { ListGridAngularTreeModule } from 'src/app/common/list-grid-tree-angular/list-grid-angular.module';
import { TabNhanVienComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/tab-nhan-vien/tab-nhan-vien.component';
import { TabNgayCongComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/tab-ngay-cong/tab-ngay-cong.component';
import { StepsModule } from 'primeng/steps';
import { DividerModule } from 'primeng/divider';
import { ChamCongComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/cham-cong/cham-cong.component';
import { AnCaComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/an-ca/an-ca.component';
import { HieuSuatLaoDongComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/hieu-suat-lao-dong/hieu-suat-lao-dong.component';
import { LamNgoaiGioComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/lam-ngoai-gio/lam-ngoai-gio.component';
import { HoTroComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/ho-tro/ho-tro.component';
import { TangGiamComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/giam-tru-thue/tang-giam.component';
import { ThietBiWifiChamCongComponent } from 'src/app/components/cs-cham-cong/thiet-bi-wifi-cham-cong/thiet-bi-wifi-cham-cong.component';
import { LoadingGridModule } from 'src/app/common/loading-grid/loading-grid.module';
import { LoadingDetailModule } from 'src/app/common/loading-detail/loading-detail.module';
import { StepInfoComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/step-info/step-info.component';
import { TongHopLuongComponent } from 'src/app/components/cs-tien-luong/tong-hop-luong/tong-hop-luong.component';
import { ChiTietTongHopLuongComponent } from 'src/app/components/cs-tien-luong/tong-hop-luong/chi-tiet-tong-hop-luong/chi-tiet-tong-hop-luong.component';
import { DsChiTietLuongComponent } from 'src/app/components/cs-tien-luong/ds-chi-tiet-luong/ds-chi-tiet-luong.component';
import { ChuyenVienTinhLuongComponent } from 'src/app/components/cs-tien-luong/chuyen-vien-tinh-luong/chuyen-vien-tinh-luong.component';
import { ChiTietChuyenVienTinhLuongComponent } from 'src/app/components/cs-tien-luong/chuyen-vien-tinh-luong/chi-tiet-chuyen-vien-tinh-luong/chi-tiet-chuyen-vien-tinh-luong.component';
import { FormActiveComponent } from 'src/app/components/cs-tien-luong/chuyen-vien-tinh-luong/form-active/form-active.component';
import { NghiKhongLuongComponent } from 'src/app/components/nghi-khong-luong/nghi-khong-luong.component';
import { ChiTietNghiKhongLuongComponent } from 'src/app/components/nghi-khong-luong/chi-tiet-nghi-khong-luong/chi-tiet-nghi-khong-luong.component';
import { ImportExcelModule } from 'src/app/common/import-excel/import-excel.module';
import { TabSalaryInsuranceComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/tab-salary-insurance/tab-salary-insurance.component';
import { TabSalaryDependentComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/tab-salary-dependent/tab-salary-dependent.component';
import { DieuChinhComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/dieu-chinh/dieu-chinh.component';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { AvatarModule } from 'primeng/avatar';
import { CsLoiChamCongComponent } from 'src/app/components/cs-loi-cham-cong/cs-loi-cham-cong.component';
import { TimeKeepingDailyComponent } from 'src/app/components/cs-cham-cong/cs-cham-cong-overview/time-keeping-daily/time-keeping-daily.component';
import { ChiTietCsLoiChamCongComponent } from 'src/app/components/cs-loi-cham-cong/chi-tiet-cs-loi-cham-cong/chi-tiet-cs-loi-cham-cong.component';
import { CsGiaiTrinhCongComponent } from 'src/app/components/cs-loi-cham-cong/cs-giai-trinh-cong/cs-giai-trinh-cong.component';
import { LeaveAnnualByEmpIdComponent } from 'src/app/components/cs-cham-cong/chi-tiet-cham-cong/leave-annual-by-emp-id/leave-annual-by-emp-id.component';
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
    CheckboxModule,
    MultiSelectModule,
    ListGridAngularModule,
    PaginatorModule,
    ButtonModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    EditDetailModule,
    FileUploadModule,
    MenuModule,
    PanelModule,
    CardModule,
    BadgeModule,
    TooltipModule,
    SliderModule,
    SidebarModule,
    ChinhSachRoutingModule,
    CurrencyFormatPipeModule,
    DialogModule,
    DropdownModule,
    TabViewModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    TreeSelectModule,
    HrmBreadCrumbModule,
    OrganizationChartModule,
    ConfigGridTableFormModule,
    CheckHideActionsDirectiveModule,
    HrmSearchEmpModule,
    StepsModule,
    DividerModule,
    AvatarModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1,
    ]),
    FormFilterModule,
    DynamicDialogModule,
    ListGridAngularTreeModule,
    LoadingGridModule,
    LoadingDetailModule,
    ImportExcelModule,
    ChartModule,
    KnobModule,
  ],

  declarations: [
    CsChamCongComponent,
    CsNghiPhepComponent,
    CsAnCaComponent,
    CsTienLuongComponent,
    CsThueThuNhapComponent,
    ChiTietNghiPhepComponent,
    ChiTietAnCaComponent,
    ChiTietChamCongComponent,
    ChiTietTienLuongComponent,
    ImportExcelComponent,
    DeleteTaxComponent,
    ChiTietThueThuNhapComponent,
    PhepNamComponent,
    PhepBuComponent,
    ChiTietPhepBuComponent,
    BieuMauComponent,
    BieuMauChiTietComponent,
    LoaiBieuMauComponent,
    ChiTietLoaiBieuMauComponent,
    XemCongComponent,
    EatingListComponent,
    ImportPhepBuComponent,
    CsChamCongOverviewComponent,
    TabNhanVienComponent,
    TabNgayCongComponent,
    ChamCongComponent,
    AnCaComponent,
    HieuSuatLaoDongComponent,
    LamNgoaiGioComponent,
    HoTroComponent,
    TangGiamComponent,
    ThietBiWifiChamCongComponent,
    StepInfoComponent,
    TongHopLuongComponent,
    ChiTietTongHopLuongComponent,
    DsChiTietLuongComponent,
    ChuyenVienTinhLuongComponent,
    ChiTietChuyenVienTinhLuongComponent,
    FormActiveComponent,
    NghiKhongLuongComponent,
    ChiTietNghiKhongLuongComponent,
    TabSalaryInsuranceComponent,
    TabSalaryDependentComponent,
    DieuChinhComponent,
    CsLoiChamCongComponent,
    TimeKeepingDailyComponent,
    ChiTietCsLoiChamCongComponent,
    CsGiaiTrinhCongComponent,
    LeaveAnnualByEmpIdComponent,


  ],
  providers: [],
})
export class ChinhSachModule {}
