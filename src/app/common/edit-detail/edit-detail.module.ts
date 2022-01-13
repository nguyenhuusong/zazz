import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { DialogModule } from 'primeng/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { AppTypeCheckboxComponent, AppTypeCheckboxListComponent, AppTypeCheckboxRadioListComponent,
   AppTypeCurrencyComponent, AppTypeDatefulltimeComponent, AppTypeDatetimeComponent, AppTypeDropdownComponent, AppTypeLinkUrlRadioListComponent,
    AppTypeMarkdownComponent, AppTypeMultiSelectComponent, AppTypeNumberComponent, AppTypeSelectComponent, AppTypeSelectTreeComponent, AppTypeTextareaComponent, AppTypeTextComponent, AppTypeTimeonlyComponent } from './chid-edit-component';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditDetailComponent } from './edit-detail.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import {TreeSelectModule} from 'primeng/treeselect';
import {ButtonModule} from 'primeng/button';
import { AgGridModule } from '@ag-grid-community/angular';
import { CurrencyDirectiveModule } from '../currency-format/currency.module';
import { CustomTooltipComponent } from '../ag-component/customtooltip.component';
import { ButtonRendererMutiComponent } from 'src/app/utils/common/button-renderermutibuttons.component';
import { PageMarkdownModule } from '../page-markdown/page-markdown.module';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogModule,
    SharedModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    PaginatorModule,
    CalendarModule,
    TabViewModule,
    TableModule,
    ToolbarModule,
    TreeSelectModule,
    CardModule,
    CheckboxModule,
    AutoCompleteModule,
    FileUploadModule,
    SelectButtonModule,
    MultiSelectModule,
    CurrencyDirectiveModule,
    PageMarkdownModule,
    RadioButtonModule,
    ButtonModule,
    TooltipModule,
    AgGridModule.withComponents([
      ButtonRendererMutiComponent,
      CustomTooltipComponent
    ]),
  ],

  declarations: [
    EditDetailComponent,
    AppTypeTextComponent,
    AppTypeSelectComponent,
    AppTypeDropdownComponent,
    AppTypeNumberComponent,
    AppTypeCurrencyComponent,
    AppTypeCheckboxComponent,
    AppTypeTextareaComponent,
    AppTypeDatetimeComponent,
    AppTypeDatefulltimeComponent,
    AppTypeTimeonlyComponent,
    AppTypeMultiSelectComponent,
    AppTypeMarkdownComponent,
    AppTypeCheckboxListComponent,
    AppTypeCheckboxRadioListComponent,
    AppTypeLinkUrlRadioListComponent,
    AppTypeSelectTreeComponent
    // AppTypeTextComponent
  ],
  exports: [
    EditDetailComponent
],

})
export class EditDetailModule { }