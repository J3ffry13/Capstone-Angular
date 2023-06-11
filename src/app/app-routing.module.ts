import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {AuthGuard} from '@guards/auth.guard';
import {NgxPermissionsGuard} from 'ngx-permissions';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {TrabajadoresListadoComponent} from '@pages/Configuracion/trabajadores/trabajadoresListado/trabajadores-listado.component';
import {TrabajadoresRegistroComponent} from '@pages/Configuracion/trabajadores/trabajadoresRegistro/trabajadores-registro.component';
import {GrupoTrabajoListadoComponent} from '@pages/Configuracion/gruposTrabajo/grupoTrabajoListado/gruposTrabajo-listado.component';
import {GrupoTrabajoRegistroComponent} from '@pages/Configuracion/gruposTrabajo/grupoTrabajoRegistro/gruposTrabajo-registro.component';
import {ActividadesListadoComponent} from '@pages/Configuracion/actividades/actividadesListado/actividades-listado.component';
import {RegistroAsistenciaRegistroComponent} from '@pages/Control-Asistencias/registroAsistencia/registroAsistencia-registro.component';
import {AsignacionLaboresListadoComponent} from '@pages/Procesos/asignacionLabores/asignacionLabores-listado/asignacionLabores-listado.component';
import {IngresosListadoComponent} from '@pages/Finanzas/Ingresos/ingresos-listado/ingresos-listado.component';
import {EgresosListadoComponent} from '@pages/Finanzas/egresos/egresos-listado/egresos-listado.component';
import {DashboardReportComponent} from '@pages/Reportes/dashboard-report/dashboard-report.component';
import {AsistenciaReportComponent} from '@pages/Reportes/asistencias-report/asistencias-report.component';
import {HorasReportComponent} from '@pages/Reportes/horas-report/horas-report.component';
import {IngresosVSegresosReportComponent} from '@pages/Reportes/IngresovsEgresos-report/ingresosVSegresos-report.component';
import {ActividadesReportComponent} from '@pages/Reportes/actividades-report/actividades-report.component';
import {UsuariosListadoComponent} from '@pages/Seguridad/usuarios/usuarios-listado/usuarios-listado.component';
import {PerfilWebListadoComponent} from '@pages/Seguridad/perfilWeb/perfil-web-listado/perfil-web-listado.component';
import {PerfilWebRegistroComponent} from '@pages/Seguridad/perfilWeb/perfil-web-registro/perfil-web-registro.component';
import { TrabajadorContratoComponent } from '@pages/Configuracion/trabajadores/trabajadorContrato/trabajador-contrato.component';

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
                component: TrabajadoresListadoComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToConfiguracionModuleTrabajadores']
                    }
                }
            },
            {
                path: 'masters/workers-reg',
                component: TrabajadoresRegistroComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToConfiguracionModuleTrabajadores']
                    }
                }
            },
            {
                path: 'masters/activities',
                component: ActividadesListadoComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToConfiguracionModuleActividades']
                    }
                }
            },
            {
                path: 'masters/workgroup',
                component: GrupoTrabajoListadoComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToConfiguracionModuleGruposTrabajo']
                    }
                }
            },
            {
                path: 'masters/workgroup-reg',
                component: GrupoTrabajoRegistroComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToConfiguracionModuleGruposTrabajo']
                    }
                }
            },
            {
                path: 'process/assigment',
                component: AsignacionLaboresListadoComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToProcessModuleAsignacionLabores']
                    }
                }
            },
            {
                path: 'assists/registerpersonal',
                component: RegistroAsistenciaRegistroComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToAssistsModuleRegistroPersonal']
                    }
                }
            },
            {
                path: 'finance/income',
                component: IngresosListadoComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToFinanceModuleIngresos']
                    }
                }
            },
            {
                path: 'finance/expenses',
                component: EgresosListadoComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToFinanceModuleEgresos']
                    }
                }
            },
            {
                path: 'reports/dashboard',
                component: DashboardReportComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToReportsModuleDashboard']
                    }
                }
            },
            {
                path: 'reports/incomevsexpenses',
                component: IngresosVSegresosReportComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToReportsModuleIngresosVSEgresos']
                    }
                }
            },
            {
                path: 'reports/asistences',
                component: AsistenciaReportComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToReportsModuleReporteAsistencias']
                    }
                }
            },
            {
                path: 'reports/hours',
                component: HorasReportComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToReportsModuleReporteHoras']
                    }
                }
            },
            {
                path: 'reports/activitiesxworkers',
                component: ActividadesReportComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToReportsModuleReporteActividades']
                    }
                }
            },
            {
                path: 'security/webprofiles',
                component: PerfilWebListadoComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToSecurityModulePerfilesWeb']
                    }
                }
            },
            {
                path: 'security/webprofiles-reg',
                component: PerfilWebRegistroComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToSecurityModulePerfilesWeb']
                    }
                }
            },
            {
                path: 'security/users',
                component: UsuariosListadoComponent,
                canActivate: [NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['accessToSecurityModuleUsuarios']
                    }
                }
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent
        // canActivate: [NonAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent
        // canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
        // canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent
    },
    {path: '**', redirectTo: '/'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
