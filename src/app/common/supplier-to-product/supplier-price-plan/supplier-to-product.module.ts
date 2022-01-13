import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonRendererComponent } from 'src/app/utils/common/button-renderer.component';
import { ButtonRendererComponent1 } from 'src/app/utils/common/button-renderer.component-1';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { AgGridModule } from '@ag-grid-community/angular';
import { SupplierPricePlanComponent } from './supplier-price-plan.component';
import { EditDetailModule } from '../../edit-detail/edit-detail.module';
import { ButtonRendererMutiComponent } from 'src/app/utils/common/button-renderermutibuttons.component';
import { ListGridAngularModule } from '../../list-grid-angular/list-grid-angular.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    ToolbarModule,
    ButtonModule,
    AutoCompleteModule,
    SplitButtonModule,
    CalendarModule,
    PaginatorModule,
    TabViewModule,
    SharedModule,
    ConfirmDialogModule,
    TableModule,
    CardModule,
    PanelModule,
    CheckboxModule,
    ListGridAngularModule,
    EditDetailModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      ButtonRendererComponent1,
      ButtonRendererMutiComponent
    ]),
  ],
  declarations: [
    SupplierPricePlanComponent
  ],
  exports: [SupplierPricePlanComponent]
})
export class SupplierPricePlanCtModule { }
