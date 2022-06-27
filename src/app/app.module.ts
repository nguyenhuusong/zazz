import { ExcelModule } from './shared/components/excel/excel.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { ExportFileService } from './services/export-file.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SunshineComponent } from './sunshine/sunshine.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { FeedBaseService } from './services/firebase.service';
import { NotificationService } from './services/notification.service';
import { AgGridModule } from '@ag-grid-community/angular';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AuthInterceptor } from './services/auth-interceptor';
import { DialogModule } from 'primeng/dialog';
import { CurrencyDirectiveModule } from './utils/common/currency.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExcelComponent } from './shared/components/excel/excel.component';
import { ApiCoreService } from './services/api-core/apicore.service';
import {ToastModule} from 'primeng/toast';
// 
import { ChartModule } from 'primeng/chart';
import {DropdownModule} from 'primeng/dropdown';
import { NumberCellRenderer } from './utils/common/number-renderer.component';
import { TextEditorComponent } from './utils/common/text-editor.component';
import {  CheckboxEditorComponent } from './utils/common/checkbox-editor.component';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {TabMenuModule} from 'primeng/tabmenu';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NavbarService } from './services/navbar.service';
import { CustomTooltipComponent } from './utils/common/customtooltip.component';
import { TooltipSuggestionComponent } from './utils/common/tooltip-suggestion.component';
import { DropdownRendererComponent } from './utils/common/dropdown-renderer.component';
import { DefaultLayoutComponent } from './containers/default-layout';
import { HomeComponent } from './pages/home/home.component';
import { CardModule } from 'primeng/card';
import {TimelineModule} from 'primeng/timeline';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ApiHrmService } from './services/api-hrm/apihrm.service';
import { BaoCaoComponent } from './components/bao-cao/bao-cao.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ListGridAngularModule } from './common/list-grid-angular/list-grid-angular.module';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { MultiSelectModule } from 'primeng/multiselect';
const APP_CONTAINERS = [DefaultLayoutComponent];
@NgModule({
    declarations: [
        AppComponent,
        ...APP_CONTAINERS,
        AuthCallbackComponent,
        SunshineComponent,
        HomeComponent,
        NumberCellRenderer,
        TextEditorComponent,
        CheckboxEditorComponent,
        CustomTooltipComponent,
        TooltipSuggestionComponent,
        DropdownRendererComponent,
        BaoCaoComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireStorageModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireDatabaseModule,
        BrowserModule,
        ButtonModule,
        DialogModule,
        CurrencyDirectiveModule,
        ConfirmDialogModule,
        SplitButtonModule,
        ScrollPanelModule,
        NgxSpinnerModule,
        ListGridAngularModule,
        BreadcrumbModule,
        OrganizationChartModule,
        MultiSelectModule,
        // AgGridModule.withComponents([
        //     ButtonRendererComponent1,
        //     NumberCellRenderer,
        //     TextEditorComponent,
        //     CheckboxEditorComponent,
        //     CustomTooltipComponent,
        //     TooltipSuggestionComponent,
        //     DropdownRendererComponent,
        //   ]),
        ExcelModule,
        ToastModule,
        ChartModule,
        TabMenuModule,
        DropdownModule,
        CalendarModule,
        AutoCompleteModule,
        CardModule,
        TimelineModule

    ],
    entryComponents: [
        ExcelComponent
    ],
    providers: [
        AuthService,
        AuthGuardService,
        FirebaseAuthService,
        ExportFileService,
        ApiService,
        ApiHrmService,
        NavbarService,
        ApiCoreService,
        FeedBaseService,
        NotificationService,
        ConfirmationService,
        MessageService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
