import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { PageMarkdownComponent } from './page-markdown.component';
import { DialogModule } from 'primeng/dialog';
import { AttackFilesModule } from '../attack-files/attack-files.module';
import { PaginatorModule } from 'primeng/paginator';
import { AgGridModule } from '@ag-grid-community/angular';
import { DialogImageModule } from 'src/app/common/dialogimage/dialogimage.module';
import { ManageMediaModule } from 'src/app/common/manage-media-module/manage-media.module';
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
    ManageMediaModule],
  exports: [PageMarkdownComponent],
  entryComponents: [],
  providers: []
})
export class PageMarkdownModule { }
