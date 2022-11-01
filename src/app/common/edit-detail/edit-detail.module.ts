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
import { AppLabel, AppTypeCheckboxComponent, AppTypeCheckboxListComponent, AppTypeCheckboxRadioListComponent,
   AppTypeChips,
   AppTypeCurrencyComponent, AppTypeDatefulltimeComponent, AppTypeDatetimeComponent, AppTypeDropdownComponent, AppTypeLinkUrlDragComponent, AppTypeLinkUrlRadioListComponent,
    AppTypelistMch,
    AppTypeMarkdownComponent, AppTypeMembers, AppTypeMultiSelectComponent, AppTypeNumberComponent, AppTypeonOff, AppTyperoomImg, AppTypeSelectAutocompleteComponent, AppTypeSelectComponent, AppTypeSelectTreeComponent, AppTypeSelectTreesComponent, AppTypeTextareaComponent, AppTypeTextComponent, AppTypeTimeonlyComponent } from './chid-edit-component';
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
import {ImageModule} from 'primeng/image';
import {PanelModule} from 'primeng/panel';
import { ConfigGridTableFormModule } from '../config-grid-table-form/config-grid-table-form.module';
import {ChipsModule} from 'primeng/chips';
import {InputSwitchModule} from 'primeng/inputswitch';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogModule,
    SharedModule,
    DialogModule,
    ToastModule,
    PanelModule,
    ImageModule,
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
    ChipsModule,
    InputSwitchModule,
    ConfigGridTableFormModule,
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
    AppTypeLinkUrlDragComponent,
    AppTypeMembers,
    AppTypeChips,
    AppTypelistMch,
    AppTypeSelectTreeComponent,
    AppTypeSelectAutocompleteComponent,
    AppTypeSelectTreesComponent,
    AppTyperoomImg,
    AppTypeonOff,
    AppLabel
    // AppTypeTextComponent
  ],
  exports: [
    EditDetailComponent
],

})
export class EditDetailModule { }