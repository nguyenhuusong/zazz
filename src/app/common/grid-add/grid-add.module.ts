import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { SharedModule } from 'src/app/shared/shared.module';
import {TabViewModule} from 'primeng/tabview';
import {InputTextModule} from 'primeng/inputtext';

import {PanelModule} from 'primeng/panel';
import { GridAddComponent } from './grid-add.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { ButtonRendererComponent } from 'src/app/utils/common/button-renderer.component';
import { ButtonAgGridComponent } from '../ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from '../ag-component/avatarFull.component';
import { SplitButtonModule } from 'primeng/splitbutton';
@NgModule({
    declarations: [GridAddComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommonModule,
        RouterModule,
        ButtonModule,
        MultiSelectModule,
        DropdownModule,
        ScrollPanelModule,
        PanelModule,
        CheckboxModule,
        CalendarModule,
        AutoCompleteModule,
        TabViewModule,
        SplitButtonModule,
        InputTextModule,
        AgGridModule.withComponents([
            ButtonRendererComponent,
            ButtonAgGridComponent,
            AvatarFullComponent
          ]),
    ],
    entryComponents: [],
    exports: [
        GridAddComponent
    ],
    providers: []
})
export class GridAddModule {}