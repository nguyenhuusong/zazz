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
import { SendNotifyComponent } from './send-notify.component';
import { GridPushListModule } from '../grid-push-list/grid-push-list.module';
import { DialogModule } from 'primeng/dialog';
import { AgGridModule } from '@ag-grid-community/angular';
import { DialogImageModule } from 'src/app/common/dialogimage/dialogimage.module';
import { ManageMediaModule } from 'src/app/common/manage-media-module/manage-media.module';
@NgModule({
  declarations: [
    SendNotifyComponent
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AgGridModule,
    SharedModule,
    ToolbarModule,
    ButtonModule,
    PaginatorModule,
    DialogImageModule,
    LMarkdownEditorModule,
    PageMarkdownModule,
    GridPushListModule,
    DialogModule,
    TabViewModule,
    ManageMediaModule],
  exports: [SendNotifyComponent],
  entryComponents: [],
  providers: []
})
export class SendNotifyModule { }
