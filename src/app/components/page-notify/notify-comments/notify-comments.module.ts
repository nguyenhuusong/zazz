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
import { NotifyCommentsComponent } from './notify-comments.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { ListGridAngularModule } from 'src/app/common/list-grid-angular/list-grid-angular.module';
import { EditDetailModule } from 'src/app/common/edit-detail/edit-detail.module';
import { CheckHideActionsDirectiveModule } from 'src/app/directive/check-action.module';
@NgModule({
    declarations: [NotifyCommentsComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ConfirmDialogModule,
        SharedModule,
        DialogModule,
        ToastModule,
        DropdownModule,
        CalendarModule,
        TabViewModule,
        TableModule,
        ToolbarModule,
        SharedModule,
        CheckboxModule,
        ListGridAngularModule,
        AutoCompleteModule,
        FileUploadModule,
        PageMarkdownModule,
        SplitterModule,
        PanelModule,
        LMarkdownEditorModule,
        TooltipModule,
        EditDetailModule,
        SelectButtonModule,
        CheckHideActionsDirectiveModule,
        // CommonSearchUserMasterModule,
        
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
      NotifyCommentsComponent
    ],
    providers: []
})
export class   NotifyCommentsModule {}