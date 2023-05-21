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
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeSelectModule } from 'primeng/treeselect';
import { ButtonModule } from 'primeng/button';
import { CurrencyDirectiveModule } from '../currency-format/currency.module';
import { ImageModule } from 'primeng/image';
import { ListGridAngularModule } from '../list-grid-angular/list-grid-angular.module';
import { PageMarkdownModule } from '../page-markdown/page-markdown.module';
import { ConfigGridTableFormModule } from '../config-grid-table-form/config-grid-table-form.module';
// import {
//   AutocompleteControlModule
//   , CheckboxControlModule
//   , CheckboxListControlModule
//   , CurrencyControlModule
//   , DatefulltimeControlModule
//   , DatetimeControlModule
//   , DatetimesControlModule
//   , DropdownControlModule
//   , MultiSelectControlModule
//   , NumberControlModule
//   , SelectTreeControlModule
//   , TextAreaControlModule
//   , TextControlModule
//   , TimeonlyControlModule
// } from 'uni-control';
import { FormFilterComponent } from './form-filter.component';
import { EditDetailModule } from '../edit-detail/edit-detail.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    PaginatorModule,
    CalendarModule,
    TabViewModule,
    TableModule,
    ToolbarModule,
    ListGridAngularModule,
    TreeSelectModule,
    CardModule,
    ImageModule,
    CheckboxModule,
    AutoCompleteModule,
    FileUploadModule,
    SelectButtonModule,
    MultiSelectModule,
    CurrencyDirectiveModule,
    ConfigGridTableFormModule,
    RadioButtonModule,
    ButtonModule,
    TooltipModule,
    PageMarkdownModule,
    // AutocompleteControlModule,
    // CheckboxControlModule,
    // CheckboxListControlModule,
    // CurrencyControlModule,
    // DatefulltimeControlModule,
    // DatetimeControlModule,
    // DatetimesControlModule,
    // DropdownControlModule,
    // MultiSelectControlModule,
    // NumberControlModule,
    // SelectTreeControlModule,
    // TextAreaControlModule,
    // TextControlModule,
    // TimeonlyControlModule,
    EditDetailModule,
    DynamicDialogModule,EditDetailModule,
  ],

  declarations: [
    FormFilterComponent
  ],
  exports: [
    FormFilterComponent
  ],

})
export class FormFilterModule { }