import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToggleFullscreenDirective } from './directives/toggle-fullscreen.directive';
import { ButtonRendererComponent } from '../utils/common/button-renderer.component';
import { NormalButtonRendererComponent } from '../utils/common/normal-button-renderer.component';
import { ButtonRendererComponent1 } from '../utils/common/button-renderer.component-1';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonRendererMutiComponent } from '../utils/common/button-renderermutibuttons.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { MarginPipe } from './margin.pipe';
import { MarginRoundPipe } from './margin-round.pipe';
import { NumericEditor } from '../utils/common/numeric-editor.component';
import { AgGridModule } from '@ag-grid-community/angular';
import {CalendarModule} from 'primeng/calendar';
import {PaginatorModule} from 'primeng/paginator';
import {MenubarModule} from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarFullComponent } from '../common/ag-component/avatarFull.component';
import { ButtonAgGridComponent } from '../common/ag-component/button-renderermutibuttons.component';
import { CustomTooltipComponent } from '../common/ag-component/customtooltip.component';
import { CurrencyFormatPipeModule } from '../common/pipe/currency-pipe.module';
import {DialogModule} from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        ToggleFullscreenDirective,
        ButtonRendererComponent,
        NormalButtonRendererComponent,
        ButtonRendererComponent1,
        ButtonRendererMutiComponent,
        AvatarFullComponent,
        MarginPipe,
        MarginRoundPipe,
        NumericEditor,
        ButtonAgGridComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        SplitButtonModule,
        FormsModule,
        DropdownModule,
        CalendarModule,
        PaginatorModule,
        AvatarModule,
        MenubarModule,
        ToolbarModule,
        CurrencyFormatPipeModule,
        MenuModule,
        DialogModule,
        MultiSelectModule,
        AgGridModule.withComponents([
            ButtonRendererComponent,
            CustomTooltipComponent,
            ButtonRendererMutiComponent,
            ButtonRendererComponent1,
            NumericEditor
          ]),
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        ToggleFullscreenDirective,
        ButtonRendererComponent,
        NormalButtonRendererComponent,
        ButtonRendererComponent1,
        AvatarFullComponent,
        ButtonRendererMutiComponent,
        MarginPipe,
        MarginRoundPipe,
        NumericEditor,
        ButtonAgGridComponent,

    ],
    entryComponents: [
    ]
})
export class SharedModule { }
