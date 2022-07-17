import { ButtonModule } from 'primeng/button';


import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { PageNotifyComponent } from './page-notify.component';
import { PageNotifyRoutingModule } from './page-notify-routing.module';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import { PageMarkdownModule } from './page-markdown/page-markdown.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaginatorModule } from 'primeng/paginator';
import { NotifyDetailModule } from './notify-detail/notify-detail.module';
import { ToolbarModule } from 'primeng/toolbar';
import { AgGridModule } from '@ag-grid-community/angular';
import { PageLoaiThongBaoComponent } from './page-loai-thong-bao/page-loai-thong-bao.component';
import { MenuModule } from 'primeng/menu';
import { ChiTietLoaiThongBaoModule } from './page-loai-thong-bao/chi-tiet-loai-thong-bao/chi-tiet-loai-thong-bao.module';
import { PageMauThongBaoComponent } from './page-mau-thong-bao/page-mau-thong-bao.component';
import { ChiTietMauThongBaoBaoModule } from './page-mau-thong-bao/chi-tiet-mau-thong-bao/chi-tiet-mau-thong-bao.module';
import { ManageMediaModule } from 'src/app/common/manage-media-module/manage-media.module';
import { DialogImageModule } from 'src/app/common/dialogimage/dialogimage.module';
import { ListGridAngularModule } from 'src/app/common/list-grid-angular/list-grid-angular.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { HrmBreadCrumbModule } from 'src/app/common/hrm-breadcrumb/hrm-breadcrumb.module';
import { ConfigGridTableFormModule } from 'src/app/common/config-grid-table-form/config-grid-table-form.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
  declarations: [
    PageNotifyComponent,
    PageLoaiThongBaoComponent,
    PageMauThongBaoComponent,
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PageNotifyRoutingModule,
    ChiTietLoaiThongBaoModule,
    ChiTietMauThongBaoBaoModule,
    MenuModule,
    AgGridModule,
    BreadcrumbModule,
    SharedModule,
    ButtonModule,
    PaginatorModule,
    PageMarkdownModule,
    AutoCompleteModule,
    DialogImageModule,
    LMarkdownEditorModule,
    ListGridAngularModule,
    DropdownModule,
    ToolbarModule,
    DialogModule,
    NotifyDetailModule,
    ManageMediaModule,
    HrmBreadCrumbModule,
    ConfigGridTableFormModule,
    OverlayPanelModule
  ],
  exports: [PageNotifyComponent],
  entryComponents: [],
})
export class PageNotifyModule { }
