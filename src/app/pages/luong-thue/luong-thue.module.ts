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
import { LuongThueRoutingModule } from './luong-thue-routing.module';
import { PageNotifyModule } from 'src/app/components/page-notify/page-notify.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { GridAddModule } from 'src/app/common/grid-add/grid-add.module';
import { PanelModule } from 'primeng/panel';
import { CommonSearchUserMasterModule } from 'src/app/common/search-user-master/search-user-master.module';
import { HrmBreadCrumbModule } from 'src/app/common/hrm-breadcrumb/hrm-breadcrumb.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfigGridTableFormModule } from 'src/app/common/config-grid-table-form/config-grid-table-form.module';
import { BangLuongComponent } from 'src/app/components/luong-thue/bang-luong/bang-luong.component';
import {ListboxModule} from 'primeng/listbox';
import { ChiTietBangLuongComponent } from 'src/app/components/luong-thue/bang-luong/chi-tiet-bang-luong/chi-tiet-bang-luong.component';
import { TabBangLuongComponent } from 'src/app/components/luong-thue/tinh-luong/tab-bang-luong/tab-bang-luong.component';
import { TabThietLapThamSoComponent } from 'src/app/components/luong-thue/tinh-luong/tab-thiet-lap-tham-so/tab-thiet-lap-tham-so.component';
import { TabThanhPhanLuongComponent } from 'src/app/components/luong-thue/tinh-luong/tab-thanh-phan-luong/tab-thanh-phan-luong.component';
import { TinhLuongComponent } from 'src/app/components/luong-thue/tinh-luong/tinh-luong.component';
import { CauTrucBangLuongComponent } from 'src/app/components/luong-thue/bang-luong/cau-truc-bang-luong/cau-truc-bang-luong.component';
import { CongThucLuongComponent } from 'src/app/components/luong-thue/bang-luong/cong-thuc-luong/cong-thuc-luong.component';
import { ChiTietThanhPhanLuongComponent } from 'src/app/components/luong-thue/tinh-luong/tab-thanh-phan-luong/chi-tiet-thanh-phan-luong/chi-tiet-thanh-phan-luong.component';
import { ChiTietTabBangLuongComponent } from 'src/app/components/luong-thue/tinh-luong/tab-bang-luong/chi-tiet-tab-bang-luong/chi-tiet-tab-bang-luong.component';
import { ChiTietTabThietLapThamSoComponent } from 'src/app/components/luong-thue/tinh-luong/tab-thiet-lap-tham-so/chi-tiet-tab-thiet-lap-tham-so/chi-tiet-tab-thiet-lap-tham-so.component';
import { TabCapBacLuongComponent } from 'src/app/components/luong-thue/tinh-luong/tab-cap-bac-luong/tab-cap-bac-luong.component';
import { ChiTietTabCapBacLuongComponent } from 'src/app/components/luong-thue/tinh-luong/tab-cap-bac-luong/chi-tiet-tab-cap-bac-luong/chi-tiet-tab-cap-bac-luong.component';
import { MucLuongComponent } from 'src/app/components/luong-thue/tinh-luong/tab-bang-luong/muc-luong/muc-luong.component';
import { FormFilterModule } from 'src/app/common/form-filter/form-filter.module';
import { StepsModule } from 'primeng/steps';
import { DividerModule } from 'primeng/divider';

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
    FormFilterModule,
    MenuModule,
    CardModule,
    BadgeModule,
    TooltipModule,
    SliderModule,
    SidebarModule,
    LuongThueRoutingModule,
    CurrencyFormatPipeModule,
    DialogModule,
    DropdownModule,
    PageNotifyModule,
    TabViewModule,
    OverlayPanelModule,
    PaginatorModule,
    GridAddModule,
    PanelModule,
    HrmBreadCrumbModule,
    CommonSearchUserMasterModule,
    ConfirmDialogModule,
    ConfigGridTableFormModule,
    CheckboxModule,
    StepsModule,
    DividerModule,
    ListboxModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1
    ]),
  ],

  declarations: [
    TinhLuongComponent,
    BangLuongComponent,
    TabThietLapThamSoComponent,
    TabBangLuongComponent,
    TabThietLapThamSoComponent,
    TabThanhPhanLuongComponent,
    TabCapBacLuongComponent,
    ChiTietBangLuongComponent,
    CauTrucBangLuongComponent,
    CongThucLuongComponent,
    ChiTietThanhPhanLuongComponent,
    ChiTietTabBangLuongComponent,
    ChiTietTabThietLapThamSoComponent,
    ChiTietTabCapBacLuongComponent,
    MucLuongComponent,

  ],
  exports: [
    TabBangLuongComponent,
    TabThietLapThamSoComponent,
    TabThanhPhanLuongComponent,
    TabCapBacLuongComponent,
    ChiTietThanhPhanLuongComponent
  ],
  providers: []
})
export class LuongThueModule { }