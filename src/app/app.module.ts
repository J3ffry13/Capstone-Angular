import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ProfileComponent} from '@pages/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ToastrModule} from 'ngx-toastr';
import {MessagesComponent} from '@modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@modules/main/header/notifications/notifications.component';
import {AngularFireModule} from '@angular/fire/compat'

import {NgOptimizedImage, registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserComponent} from '@modules/main/header/user/user.component';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {LanguageComponent} from '@modules/main/header/language/language.component';
import {MainMenuComponent} from './pages/main-menu/main-menu.component';
import {SubMenuComponent} from './pages/main-menu/sub-menu/sub-menu.component';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {ControlSidebarComponent} from './modules/main/control-sidebar/control-sidebar.component';
import {StoreModule} from '@ngrx/store';
import {authReducer} from './store/auth/reducer';
import {uiReducer} from './store/ui/reducer';
import {ProfabricComponentsModule} from '@profabric/angular-components';
import {defineCustomElements} from '@profabric/web-components/loader';
import {SidebarSearchComponent} from './components/sidebar-search/sidebar-search.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AuthInterceptorService} from '@services/auth/auth-Interceptor.service';
import {ClientesListadoComponent} from '@pages/clientes/clientesListado/clientes-listado.component';
import {ClientesRegistroComponent} from '@pages/clientes/clientesRegistro/clientes-registro.component';
import {ConfirmActionComponent} from './components/crud/confirm-action/confirm-action.component';
import {SnackbarComponent} from './components/crud/snackbar/snackbar.component';
import {LoaderComponent} from './components/crud/loader/loader.component';
import { environment } from 'environments/environment';
import { TrabajadoresListadoComponent } from '@pages/trabajadores/trabajadoresListado/trabajadores-listado.component';
import { TrabajadoresRegistroComponent } from '@pages/trabajadores/trabajadoresRegistro/trabajadores-registro.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideStorage } from '@angular/fire/storage';
import { getStorage } from 'firebase/storage';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS_DDMMYYY } from './utils/format-datepicker';
import { TrabajadorContratoComponent } from '@pages/trabajadores/trabajadorContrato/trabajador-contrato.component';

defineCustomElements();
registerLocaleData(localeEn, 'es-ES');

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        BlankComponent,
        ProfileComponent,
        RegisterComponent,
        DashboardComponent,
        MessagesComponent,
        NotificationsComponent,
        UserComponent,
        ForgotPasswordComponent,
        RecoverPasswordComponent,
        LanguageComponent,
        MainMenuComponent,
        SubMenuComponent,
        MenuItemComponent,
        ControlSidebarComponent,
        SidebarSearchComponent,
        ClientesListadoComponent,
        ClientesRegistroComponent,
        ConfirmActionComponent,
        SnackbarComponent,
        LoaderComponent,
        TrabajadoresListadoComponent,
        TrabajadoresRegistroComponent,
        TrabajadorContratoComponent,
    ],
    imports: [
        BrowserModule,
        StoreModule.forRoot({auth: authReducer, ui: uiReducer}),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        ProfabricComponentsModule,
        /////////////////
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatCardModule,
        NgOptimizedImage,
        MatDatepickerModule,        
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideStorage(() => getStorage())
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: MY_FORMATS_DDMMYYY,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
