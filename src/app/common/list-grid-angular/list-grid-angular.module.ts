import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ListGridAngularComponent } from './list-grid-angular.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { ButtonModule } from 'primeng/button';
import { ConfigGridTableFormModule } from '../config-grid-table-form/config-grid-table-form.module';
import { DialogModule } from 'primeng/dialog';
@NgModule({
    declarations: [ListGridAngularComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        AgGridModule,
        ButtonModule,
        DialogModule,

    ],
    entryComponents: [],
    exports: [
        ListGridAngularComponent
    ],
    providers: []
})
export class ListGridAngularModule {}