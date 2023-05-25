import { ButtonModule } from 'primeng/button';


import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { PageMarkdownComponent } from './page-markdown.component';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { AgGridModule } from '@ag-grid-community/angular';
import { DialogImageModule } from '../dialogimage/dialogimage.module';
import { AttackFilesModule } from '../attack-files/attack-files.module';
import { ManageMediaModule } from '../manage-media-module/manage-media.module';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { SidebarModule } from 'primeng/sidebar';
@NgModule({
  declarations: [
    PageMarkdownComponent,
   ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
   
    AgGridModule,
    SharedModule,
    ButtonModule,
    DialogImageModule,
    LMarkdownEditorModule,
    AttackFilesModule,
    DialogModule,
    TabViewModule,
    PaginatorModule,
    SidebarModule,
    ManageMediaModule],
  exports: [PageMarkdownComponent],
  entryComponents: [],
  providers: []
})
export class PageMarkdownModule { }
