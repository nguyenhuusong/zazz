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
import { SearchUserMasterComponent } from './search-user-master.component';
import {TabViewModule} from 'primeng/tabview';
import {InputTextModule} from 'primeng/inputtext';
import { AgGridModule } from '@ag-grid-community/angular';
import { ButtonAgGridComponent } from '../ag-component/button-renderermutibuttons.component';
import { AvatarFullComponent } from '../ag-component/avatarFull.component';

@NgModule({
    declarations: [SearchUserMasterComponent],
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
        CheckboxModule,
        CalendarModule,
        AutoCompleteModule,
        TabViewModule,
        InputTextModule,
        AgGridModule.withComponents([
            ButtonAgGridComponent,
            AvatarFullComponent
          ]),
    ],
    entryComponents: [],
    exports: [
        SearchUserMasterComponent
    ],
    providers: []
})
export class CommonSearchUserMasterModule {}