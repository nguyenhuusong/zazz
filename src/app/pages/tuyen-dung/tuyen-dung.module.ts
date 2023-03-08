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
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {SidebarModule} from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { NsTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-tuyen-dung.component';
import { ViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/vi-tri-tuyen-dung/vi-tri-tuyen-dung.component';
import { LinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/linh-vuc-tuyen-dung/linh-vuc-tuyen-dung.component';
import { ChiTietTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-tuyen-dung/chi-tiet-tuyen-dung.component';
import { ChiTietViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-vi-tri-tuyen-dung/chi-tiet-vi-tri-tuyen-dung.component';
import { ChiTietLinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung.component';
import {ImageModule} from 'primeng/image';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {ListboxModule} from 'primeng/listbox';
import {PanelModule} from 'primeng/panel';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TimelineModule} from 'primeng/timeline';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { UserDetailModule } from 'src/app/components/ns-ho-so-nhan-su/user-detail/user-detail.module';
import { DetailAccountModule } from 'src/app/components/ns-ho-so-nhan-su/detail-account/detail-account.module';
import { UploadFileModule } from 'src/app/common/upload-file/upload-file.module';
import { EmpAttachFileModule } from 'src/app/components/ns-ho-so-nhan-su/emp-attach-file/emp-attach-file.module';
import { TuyenDungRoutingModule } from './tuyen-dung-routing.module';
import { HrmBreadCrumbModule } from 'src/app/common/hrm-breadcrumb/hrm-breadcrumb.module';
import { ConfigGridTableFormModule } from 'src/app/common/config-grid-table-form/config-grid-table-form.module';
import { CheckHideActionsDirectiveModule } from 'src/app/directive/check-action.module';
import { NghiViecComponent } from 'src/app/components/ns-tuyen-dung/nghi-viec/nghi-viec.component';
import { TreeSelectModule } from 'primeng/treeselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MailTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/mail-tuyen-dung/mail-tuyen-dung.component';
import { ChiTietMailTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/mail-tuyen-dung/chi-tiet-mail-tuyen-dung/chi-tiet-mail-tuyen-dung.component';
import { ImportTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/import-tuyen-dung/import-tuyen-dung.component';
import { DsTiemNangComponent } from 'src/app/components/ns-tuyen-dung/ds-tiem-nang/ds-tiem-nang.component';
import { MailDaGuiComponent } from 'src/app/components/ns-tuyen-dung/mail-da-gui/mail-da-gui.component';
import { NsCauHinhComponent } from 'src/app/components/ns-tuyen-dung/ns-cau-hinh/ns-cau-hinh.component';
import { VongTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-cau-hinh/vong-tuyen-dung/vong-tuyen-dung.component';
import { ChiTietVongTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-cau-hinh/vong-tuyen-dung/chi-tiet-vong-tuyen-dung/chi-tiet-vong-tuyen-dung.component';
import { NsCauHinhMailComponent } from 'src/app/components/ns-tuyen-dung/ns-cau-hinh/ns-cau-hinh-mail/ns-cau-hinh-mail.component';
import { NguonTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-cau-hinh/nguon-tuyen-dung/nguon-tuyen-dung.component';
import { ChiTietNguonTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-cau-hinh/nguon-tuyen-dung/chi-tiet-nguon-tuyen-dung/chi-tiet-nguon-tuyen-dung.component';
import { NsChiTietCauHinhMailComponent } from 'src/app/components/ns-tuyen-dung/ns-cau-hinh/ns-cau-hinh-mail/chi-tiet-cau-hinh-mail/chi-tiet-ns-cau-hinh-mail.component';
import { HrmStepModule } from 'src/app/common/hrm-steps/hrm-step.module';
import { FormFilterModule } from 'src/app/common/form-filter/form-filter.module';
import { KeHoachTuyenDungComponent } from 'src/app/components/ke-hoach-tuyen-dung/ke-hoach-tuyen-dung.component';
import { ChiTietKeHoachTuyenDungComponent } from 'src/app/components/ke-hoach-tuyen-dung/chi-tiet-ke-hoach-tuyen-dung/chi-tiet-ke-hoach-tuyen-dung.component';
import { ImportKeHoachComponent } from 'src/app/components/ke-hoach-tuyen-dung/import-ke-hoach/import-ke-hoach.component';
import { DividerModule } from 'primeng/divider';
import { StepsModule } from 'primeng/steps';
import { ImportLinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/linh-vuc-tuyen-dung/import-linh-vuc-tuyen-dung/import-linh-vuc-tuyen-dung.component';
import { ImportExcelModule } from 'src/app/common/import-excel/import-excel.module';
import { LoadingGridModule } from 'src/app/common/loading-grid/loading-grid.module';
@NgModule({
  imports: [
    MessagesModule,
    MessageModule,
    SelectButtonModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    CommonModule,
    TreeModule,
    TimelineModule,
    TableModule,
    OverlayPanelModule,
    BreadcrumbModule,
    ConfigGridTableFormModule,
    DetailAccountModule,
    ListboxModule,
    UserDetailModule,
    MultiSelectModule,
    ListGridAngularModule,
    PaginatorModule,
    ButtonModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    EditDetailModule,
    FormFilterModule,
    FileUploadModule,
    MenuModule,
    CardModule,
    OrganizationChartModule,
    BadgeModule,
    TooltipModule,
    SliderModule,
    SidebarModule,
    TuyenDungRoutingModule,
    CurrencyFormatPipeModule,
    DialogModule,
    ImageModule,
    DropdownModule,
    TabViewModule,
    ConfirmDialogModule,
    UploadFileModule,
    EmpAttachFileModule,
    HrmBreadCrumbModule,
    LoadingGridModule,
    CheckHideActionsDirectiveModule,
    TreeSelectModule,
    RadioButtonModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1
    ]),
    HrmStepModule,
    DividerModule,
    StepsModule,
    ImportExcelModule
  ],

  declarations: [
    NsTuyenDungComponent,
    ViTriTuyenDungComponent,
    LinhVucTuyenDungComponent,
    ChiTietLinhVucTuyenDungComponent,
    ChiTietTuyenDungComponent,
    ChiTietViTriTuyenDungComponent,
    NghiViecComponent,
    MailTuyenDungComponent,
    ChiTietMailTuyenDungComponent,
    ImportTuyenDungComponent,
    DsTiemNangComponent,
    MailDaGuiComponent,
    NsCauHinhComponent,
    VongTuyenDungComponent,
    ChiTietVongTuyenDungComponent,
    NsCauHinhMailComponent,
    NguonTuyenDungComponent,
    ChiTietNguonTuyenDungComponent,
    NsChiTietCauHinhMailComponent,
    KeHoachTuyenDungComponent,
    ChiTietKeHoachTuyenDungComponent,
    ImportKeHoachComponent,
    ImportLinhVucTuyenDungComponent
  ],
  providers: [ ]
})
export class TuyenDungModule { }