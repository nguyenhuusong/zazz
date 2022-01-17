import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import {DropdownModule} from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import {PaginatorModule} from 'primeng/paginator';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { SplitterModule } from 'primeng/splitter';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { SelectButtonModule } from 'primeng/selectbutton';
import {PickListModule} from 'primeng/picklist';
import {TreeTableModule} from 'primeng/treetable';
import {SidebarModule} from 'primeng/sidebar';
import { ChipModule } from 'primeng/chip';
import { UserDetailComponent } from './user-detail.component';
import { EditDetailModule } from 'src/app/common/edit-detail/edit-detail.module';
@NgModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      ConfirmDialogModule,
      SharedModule,
      TreeTableModule,
      DialogModule,
      ToastModule,
      DropdownModule,
      PaginatorModule,
      CalendarModule,
      TabViewModule,
      TableModule,
      ToolbarModule,
      ChipModule,
      SidebarModule,
      CardModule,
      CheckboxModule,
      AutoCompleteModule,
      FileUploadModule,
      SplitterModule,
      TooltipModule,
      PanelModule,
      EditDetailModule,
      SelectButtonModule,
      PickListModule,
    ],
    
    declarations: [
      UserDetailComponent,
    ],
    exports: [UserDetailComponent]
  })
  export class UserDetailModule { }