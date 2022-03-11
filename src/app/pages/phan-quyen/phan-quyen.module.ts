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
import { PageNotifyModule } from 'src/app/components/page-notify/page-notify.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { PanelModule } from 'primeng/panel';
import { PhanQuyenRoutingModule } from './phan-quyen-routing.module';
import { PqThangMayComponent } from 'src/app/components/pq-thang-may/pq-thang-may.component';
import { PqTheNhanVienComponent } from 'src/app/components/pq-the-nhan-vien/pq-the-nhan-vien.component';
import { PqXeNhanVienComponent } from 'src/app/components/pq-xe-nhan-vien/pq-xe-nhan-vien.component';
import { PqQuyenNguoiDungComponent } from 'src/app/components/pq-quyen-nguoi-dung/pq-quyen-nguoi-dung.component';
import { ThietBiThangMayComponent } from 'src/app/components/thiet-bi-thang-may/thiet-bi-thang-may.component';
import { ThietLapTangThangMayComponent } from 'src/app/components/thiet-lap-tang-thang-may/thiet-lap-tang-thang-may.component';
import { CardDetailComponent } from 'src/app/components/pq-the-nhan-vien/card-detail/card-detail.component';
import { ChiTietTheNhanVienComponent } from 'src/app/components/pq-the-nhan-vien/chi-tiet-the-nhan-vien/chi-tiet-the-nhan-vien.component';

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
    PhanQuyenRoutingModule,
    CurrencyFormatPipeModule,
    DialogModule,
    DropdownModule,
    PageNotifyModule,
    TabViewModule,
    PaginatorModule,
    PanelModule,
    ConfirmDialogModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1
    ]),
  ],

  declarations: [
    PqThangMayComponent,
    PqTheNhanVienComponent,
    PqXeNhanVienComponent,
    PqQuyenNguoiDungComponent,
    ThietBiThangMayComponent,
    ThietLapTangThangMayComponent,
    CardDetailComponent,
    ChiTietTheNhanVienComponent
  ],
  providers: []
})
export class PhanQuyenModule { }