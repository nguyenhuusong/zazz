import { ButtonModule } from 'primeng/button';


import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { PageMarkdownModule } from '../page-markdown/page-markdown.module';
import {PaginatorModule} from 'primeng/paginator';
import { ToolbarModule } from 'primeng/toolbar';
import { StoreNotifyModule } from '../store-notify/store-notify.module';
import { DialogModule } from 'primeng/dialog';
import { GridPushListComponent } from './grid-push-list.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { DialogImageModule } from 'src/app/common/dialogimage/dialogimage.module';
import { ManageMediaModule } from 'src/app/common/manage-media-module/manage-media.module';
import { ListGridAngularModule } from 'src/app/common/list-grid-angular/list-grid-angular.module';
import { CheckHideActionsDirectiveModule } from 'src/app/directive/check-action.module';
import { LoadingGridModule } from 'src/app/common/loading-grid/loading-grid.module';
@NgModule({
  declarations: [
    GridPushListComponent
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckHideActionsDirectiveModule,
    AgGridModule,
    SharedModule,
    ToolbarModule,
    ButtonModule,
    PaginatorModule,
    StoreNotifyModule,
    DialogImageModule,
    LMarkdownEditorModule,
    PageMarkdownModule,
    DialogModule,
    ListGridAngularModule,
    LoadingGridModule,
    TabViewModule,
    ManageMediaModule],
  exports: [GridPushListComponent],
  entryComponents: [],
  providers: []
})
export class GridPushListModule { }
