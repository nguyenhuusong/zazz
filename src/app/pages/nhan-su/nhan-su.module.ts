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
import { NhanSuRoutingModule } from './nhan-su-routing.module';
import { NsHoSoNhanSuComponent } from 'src/app/components/ns-ho-so-nhan-su/ns-ho-so-nhan-su.component';
import { NsHoSoNghiViecComponent } from 'src/app/components/ns-ho-so-nghi-viec/ns-ho-so-nghi-viec.component';
import {ImageModule} from 'primeng/image';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {ListboxModule} from 'primeng/listbox';
import {PanelModule} from 'primeng/panel';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TimelineModule} from 'primeng/timeline';
import { ChiTietHoSoNhanSuComponent } from 'src/app/components/ns-ho-so-nhan-su/chi-tiet-ho-so-nhan-su/chi-tiet-ho-so-nhan-su.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { UserDetailModule } from 'src/app/components/ns-ho-so-nhan-su/user-detail/user-detail.module';
import { DetailAccountModule } from 'src/app/components/ns-ho-so-nhan-su/detail-account/detail-account.module';
import { AddAddressContactComponent } from 'src/app/components/ns-ho-so-nhan-su/add-address-contact/add-address-contact.component';
import { CardInfoComponent } from 'src/app/components/ns-ho-so-nhan-su/card-info/card-info.component';
import { DetectCardComponent } from 'src/app/components/ns-ho-so-nhan-su/detect-card/detect-card.component';
import { UploadFileModule } from 'src/app/common/upload-file/upload-file.module';
import { EmpAttachFileModule } from 'src/app/components/ns-ho-so-nhan-su/emp-attach-file/emp-attach-file.module';
import { CreateContractInfoComponent } from 'src/app/components/ns-ho-so-nhan-su/create-contract-info/create-contract-info.component';
import { ChiTietHoSoNghiViecComponent } from 'src/app/components/ns-ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec.component';
import { ThaiSanComponent } from 'src/app/components/thai-san/thai-san.component';
import { ChiTietThaiSanComponent } from 'src/app/components/thai-san/chi-tiet-thai-san/chi-tiet-thai-san.component';
import {TreeSelectModule} from 'primeng/treeselect';
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
    NhanSuRoutingModule,
    CurrencyFormatPipeModule,
    DialogModule,
    ImageModule,
    DropdownModule,
    TabViewModule,
    ConfirmDialogModule,
    UploadFileModule,
    EmpAttachFileModule,
    TreeSelectModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1
    ]),
  ],

  declarations: [
    NsHoSoNhanSuComponent,
    NsHoSoNghiViecComponent,
    ChiTietHoSoNhanSuComponent,
    AddAddressContactComponent,
    CardInfoComponent,
    DetectCardComponent,
    CreateContractInfoComponent,
    ChiTietHoSoNghiViecComponent,
    ThaiSanComponent,
    ChiTietThaiSanComponent
  ],
  providers: [ ]
})
export class NhanSuModule { }