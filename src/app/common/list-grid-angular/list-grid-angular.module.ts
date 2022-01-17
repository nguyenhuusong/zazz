import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ListGridAngularComponent } from './list-grid-angular.component';
import { AgGridModule } from '@ag-grid-community/angular';
@NgModule({
    declarations: [ListGridAngularComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        AgGridModule
    ],
    entryComponents: [],
    exports: [
        ListGridAngularComponent
    ],
    providers: []
})
export class ListGridAngularModule {}