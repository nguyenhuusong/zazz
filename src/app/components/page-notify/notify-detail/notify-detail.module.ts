import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { SplitterModule } from 'primeng/splitter';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { PageMarkdownModule } from '../page-markdown/page-markdown.module';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NotifyDetailComponent } from './notify-detail.component';
import { NotifyCommentsModule } from '../notify-comments/notify-comments.module';
import { GridPushListModule } from '../grid-push-list/grid-push-list.module';
import { StoreNotifyModule } from '../store-notify/store-notify.module';
import { SendNotifyModule } from '../send-notify/send-notify.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { ListGridAngularModule } from 'src/app/common/list-grid-angular/list-grid-angular.module';
import { EditDetailModule } from 'src/app/common/edit-detail/edit-detail.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { LoadingDetailModule } from 'src/app/common/loading-detail/loading-detail.module';
import { GetNotifyToComponent } from '../get-notify-to/get-notify-to.component';
import { DividerModule } from 'primeng/divider';@NgModule({
    declarations: [NotifyDetailComponent, GetNotifyToComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ConfirmDialogModule,
        SharedModule,
        ToastModule,
        DropdownModule,
        CalendarModule,
        TabViewModule,
        TableModule,
        BreadcrumbModule,
        ToolbarModule,
        SharedModule,
        CheckboxModule,
        DividerModule,
        ListGridAngularModule,
        AutoCompleteModule,
        FileUploadModule,
        PageMarkdownModule,
        SplitterModule,
        PanelModule,
        GridPushListModule,
        LMarkdownEditorModule,
        TooltipModule,
        EditDetailModule,
        SelectButtonModule,
        NotifyCommentsModule,
        StoreNotifyModule,
        SendNotifyModule,
        DialogModule,
        LoadingDetailModule,
      AgGridModule.withComponents([
        // ButtonRendererComponent,
        // ButtonRendererComponent1,
        // ButtonRendererMutiComponent,
        // ButtonUploadComponent,
        // AvatarFullComponent
      ]),
    ],
    entryComponents: [],
    exports: [
      NotifyDetailComponent
    ],
    providers: []
})
export class   NotifyDetailModule {}