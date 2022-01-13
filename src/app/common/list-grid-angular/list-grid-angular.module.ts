import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ListGridAngularComponent } from './list-grid-angular.component';
import { ButtonAgGridComponent } from '../ag-component/button-renderermutibuttons.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { AvatarFullComponent } from '../ag-component/avatarFull.component';
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