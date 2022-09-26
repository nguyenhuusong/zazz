import { OrganizationChartModule } from 'primeng/organizationchart';
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
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TreeSelectModule } from 'primeng/treeselect';
import { HrmBreadCrumbModule } from 'src/app/common/hrm-breadcrumb/hrm-breadcrumb.module';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfigGridTableFormModule } from 'src/app/common/config-grid-table-form/config-grid-table-form.module';
import { HoatDongRoutingModule } from './hoat-dong-routing.module';

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
    CardModule,
    BadgeModule,
    TooltipModule,
    SliderModule,
    SidebarModule,
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
    HoatDongRoutingModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1,
    ]),
  ],

  declarations: [
    
  ],
  providers: [],
})
export class HoatDongModule {}
