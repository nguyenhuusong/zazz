import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CustomTooltipComponent } from '../ag-component/customtooltip.component';
import { ButtonAgGridComponent } from '../ag-component/button-renderermutibuttons.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { AvatarFullComponent } from '../ag-component/avatarFull.component';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ListGridAngularTreeComponent } from './list-grid-angular.component';
@NgModule({
    declarations: [ListGridAngularTreeComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        RatingModule,
        ButtonModule,
        DialogModule,
        AgGridModule.withComponents([
            CustomTooltipComponent,
            ButtonAgGridComponent,
            AvatarFullComponent,
          ]),
    ],
    entryComponents: [],
    exports: [
        ListGridAngularTreeComponent
    ],
    providers: []
})
export class ListGridAngularTreeModule {}