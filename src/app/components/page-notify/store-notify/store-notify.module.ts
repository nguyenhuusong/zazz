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
import { StoreNotifyComponent } from './store-notify.component';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { TreeSelectModule} from 'primeng/treeselect';
import { AgGridModule } from '@ag-grid-community/angular';
import { BadgeModule } from 'primeng/badge';
import { ListGridAngularModule } from 'src/app/common/list-grid-angular/list-grid-angular.module';
import { CheckHideActionsDirectiveModule } from 'src/app/directive/check-action.module';
@NgModule({
  declarations: [
    StoreNotifyComponent
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TreeSelectModule,
    AgGridModule,
    SharedModule,
    ToolbarModule,
    BadgeModule,
    ButtonModule,
    PaginatorModule,
    AutoCompleteModule,
    LMarkdownEditorModule,
    PageMarkdownModule,
    ListGridAngularModule,
    DropdownModule,
    CheckHideActionsDirectiveModule,
    TabViewModule,],
  exports: [StoreNotifyComponent],
  entryComponents: [],
  providers: []
})
export class StoreNotifyModule { }
