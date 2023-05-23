import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {AuthGuard} from '@guards/auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import { TrabajadoresListadoComponent } from '@pages/Configuracion/trabajadores/trabajadoresListado/trabajadores-listado.component';
import { TrabajadoresRegistroComponent } from '@pages/Configuracion/trabajadores/trabajadoresRegistro/trabajadores-registro.component';
import { GrupoTrabajoListadoComponent } from '@pages/Configuracion/gruposTrabajo/grupoTrabajoListado/gruposTrabajo-listado.component';
import { GrupoTrabajoRegistroComponent } from '@pages/Configuracion/gruposTrabajo/grupoTrabajoRegistro/gruposTrabajo-registro.component';
import { ActividadesListadoComponent } from '@pages/Configuracion/actividades/actividadesListado/actividades-listado.component';
import { RegistroAsistenciaRegistroComponent } from '@pages/Control-Asistencias/registroAsistencia/registroAsistencia-registro.component';
import { AsignacionLaboresListadoComponent } from '@pages/Procesos/asignacionLabores/asignacionLabores-listado/asignacionLabores-listado.component';
import { IngresosListadoComponent } from '@pages/Finanzas/Ingresos/ingresos-listado/ingresos-listado.component';
import { EgresosListadoComponent } from '@pages/Finanzas/egresos/egresos-listado/egresos-listado.component';
import { DashboardReportComponent } from '@pages/Reportes/dashboard-report/dashboard-report.component';
import { AsistenciaReportComponent } from '@pages/Reportes/asistencias-report/asistencias-report.component';
import { HorasReportComponent } from '@pages/Reportes/horas-report/horas-report.component';
import { IngresosVSegresosReportComponent } from '@pages/Reportes/IngresovsEgresos-report/ingresosVSegresos-report.component';
import { ActividadesReportComponent } from '@pages/Reportes/actividades-report/actividades-report.component';
import { UsuariosListadoComponent } from '@pages/Seguridad/usuarios/usuarios-listado/usuarios-listado.component';
import { PerfilWebListadoComponent } from '@pages/Seguridad/perfilWeb/perfil-web-listado/perfil-web-listado.component';
import { PerfilWebRegistroComponent } from '@pages/Seguridad/perfilWeb/perfil-web-registro/perfil-web-registro.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            ///////
            {
                path: '',
                component: DashboardComponent
            },
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
            {
                path: 'process/assigment',
                component: AsignacionLaboresListadoComponent
            },
            {
                path: 'assists/registerpersonal',
                component: RegistroAsistenciaRegistroComponent
            },
            {
                path: 'finance/income',
                component: IngresosListadoComponent,
            },
            {
                path: 'finance/expenses',
                component: EgresosListadoComponent,
            },
            {
                path: 'reports/dashboard',
                component: DashboardReportComponent,
            },
            {
                path: 'reports/incomevsexpenses',
                component: IngresosVSegresosReportComponent,
            },
            {
                path: 'reports/asistences',
                component: AsistenciaReportComponent,
            },
            {
                path: 'reports/hours',
                component: HorasReportComponent,
            },
            {
                path: 'reports/activitiesxworkers',
                component: ActividadesReportComponent,
            },
            {
                path: 'security/webprofiles',
                component: PerfilWebListadoComponent,
            },
            {
                path: 'security/webprofiles-reg',
                component: PerfilWebRegistroComponent,
            },
            {
                path: 'security/users',
                component: UsuariosListadoComponent,
            },
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
