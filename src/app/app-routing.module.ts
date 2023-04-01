import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {LoginComponent} from '@modules/login/login.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {AuthGuard} from '@guards/auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import { TrabajadoresListadoComponent } from '@pages/trabajadores/trabajadoresListado/trabajadores-listado.component';
import { TrabajadoresRegistroComponent } from '@pages/trabajadores/trabajadoresRegistro/trabajadores-registro.component';
import { GrupoTrabajoListadoComponent } from '@pages/gruposTrabajo/grupoTrabajoListado/gruposTrabajo-listado.component';
import { GrupoTrabajoRegistroComponent } from '@pages/gruposTrabajo/grupoTrabajoRegistro/gruposTrabajo-registro.component';
import { ActividadesListadoComponent } from '@pages/actividades/actividadesListado/actividades-listado.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            ///////
            {
                path: 'masters/workers',
                component: TrabajadoresListadoComponent
            },
            {
                path: 'masters/workers-reg',
                component: TrabajadoresRegistroComponent
            },
            {
                path: 'masters/activities',
                component: ActividadesListadoComponent
            },
            {
                path: 'masters/workgroup',
                component: GrupoTrabajoListadoComponent
            },
            {
                path: 'masters/workgroup-reg',
                component: GrupoTrabajoRegistroComponent
            },
            // ///////
            // {
            //     path: 'process/reception',
            //     component: RecepcionProductosListadoComponent
            // },
            // {
            //     path: 'process/reception/register',
            //     component: RecepcionProductosRegistroComponent
            // },
            // {
            //     path: 'sub-menu-2',
            //     component: BlankComponent
            // },
            {
                path: '',
                component: DashboardComponent
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        // canActivate: [NonAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        // canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        // canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        // canActivate: [NonAuthGuard]
    },
    {path: '**', redirectTo: '/'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
