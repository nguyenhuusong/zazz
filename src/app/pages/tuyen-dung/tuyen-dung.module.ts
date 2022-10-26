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
    CheckHideActionsDirectiveModule,
    TreeSelectModule,
    RadioButtonModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1
    ]),
  ],

  declarations: [
    NsTuyenDungComponent,
    ViTriTuyenDungComponent,
    LinhVucTuyenDungComponent,
    ChiTietLinhVucTuyenDungComponent,
    ChiTietTuyenDungComponent,
    ChiTietViTriTuyenDungComponent,
    NghiViecComponent
  ],
  providers: [ ]
})
export class TuyenDungModule { }