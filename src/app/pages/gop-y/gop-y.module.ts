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
import { GridAddModule } from 'src/app/common/grid-add/grid-add.module';
import { PanelModule } from 'primeng/panel';
import { CommonSearchUserMasterModule } from 'src/app/common/search-user-master/search-user-master.module';
import { GopYKienComponent } from 'src/app/components/gop-y-kien/gop-y-kien.component';
import { ChiTietGopYComponent } from 'src/app/components/gop-y-kien/chi-tiet-gop-y/chi-tiet-gop-y.component';
import { GopYRoutingModule } from './gop-y-routing.module';
import { HrmBreadCrumbModule } from 'src/app/common/hrm-breadcrumb/hrm-breadcrumb.module';
import { ConfigGridTableFormModule } from 'src/app/common/config-grid-table-form/config-grid-table-form.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FormFilterModule } from 'src/app/common/form-filter/form-filter.module';
import { LoadingGridModule } from 'src/app/common/loading-grid/loading-grid.module';
import { LoadingDetailModule } from 'src/app/common/loading-detail/loading-detail.module';

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
    ConfigGridTableFormModule,
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
    GopYRoutingModule,
    CurrencyFormatPipeModule,
    FormFilterModule,
    DialogModule,
    DropdownModule,
    PageNotifyModule,
    TabViewModule,
    PaginatorModule,
    GridAddModule,
    PanelModule,
    CommonSearchUserMasterModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    HrmBreadCrumbModule,
    LoadingGridModule,
    LoadingDetailModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1
    ]),
  ],

  declarations: [
    GopYKienComponent,
    ChiTietGopYComponent
  ],
  providers: []
})
export class GopYModule { }