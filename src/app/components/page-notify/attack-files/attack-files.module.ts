import { ButtonModule } from 'primeng/button';


import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { AttackFilesComponent } from './attack-files.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { DialogImageModule } from 'src/app/common/dialogimage/dialogimage.module';
import { ManageMediaModule } from 'src/app/common/manage-media-module/manage-media.module';
@NgModule({
  declarations: [
    AttackFilesComponent
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
    DialogModule,
    TabViewModule,
    ManageMediaModule],
  exports: [AttackFilesComponent],
  entryComponents: [],
  providers: []
})
export class AttackFilesModule { }
