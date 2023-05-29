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
import { ConfigGridTableFormComponent } from './config-grid-table-form.component';
import { ListGridAngularModule } from '../list-grid-angular/list-grid-angular.module';
import { ButtonModule } from 'primeng/button';
@NgModule({
    declarations: [ConfigGridTableFormComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        RatingModule,
        DialogModule,
        ButtonModule,
        ListGridAngularModule,
        AgGridModule.withComponents([
            CustomTooltipComponent,
            ButtonAgGridComponent,
            AvatarFullComponent,
          ]),
    ],
    entryComponents: [],
    exports: [
        ConfigGridTableFormComponent
    ],
    providers: []
})
export class ConfigGridTableFormModule {}