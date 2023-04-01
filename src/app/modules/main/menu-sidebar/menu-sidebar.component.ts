import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import {Observable} from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user;
    public menu = MENU;

    constructor(
        public appService: AppService,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        this.user = this.appService.user;
    }
}
//https://www.w3schools.com/icons/fontawesome5_icons_code.asp
export const MENU = [
    {
        name: 'CONFIGUACIÓN',
        iconClasses: 'fas fa-th-list',
        // path: ['/masters/'],
        children: [
            {
                name: 'Trabajadores',
                iconClasses: 'fas fa-user-alt',
                path: ['/masters/workers']
            },
            {
                name: 'Actividades',
                iconClasses: 'fas fa-tasks',
                path: ['masters/activities']
            },
            {
                name: 'Grupos de Trabajo',
                iconClasses: 'fas fa-users',
                path: ['masters/workgroup']
            }
        ]
    },
    {
        name: 'PROCESOS',
        iconClasses: 'fas fa-edit',
        children: [
            {
                name: 'Asiganción de Labores',
                iconClasses: 'fas fa-tools',
                path: ['/process/assigment']
            },
        ]
    },
    {
        name: 'ASISTENCIAS',
        iconClasses: 'fas fa-calendar-alt',        
        children: [
            {
                name: 'Registro Personal',
                iconClasses: 'fas fa-user-clock',
                path: ['/assists/registerpersonal']
            },
        ]
    },
    {
        name: 'FINANZAS',
        iconClasses: 'fas fa-donate',        
        children: [
            {
                name: 'Ingresos',
                iconClasses: 'fas fa-comment-dollar',
                path: ['/finance/income']
            },
            {
                name: 'Egresos',
                iconClasses: '	fas fa-comments-dollar',
                path: ['/finance/expenses']
            },
        ]
    },
    {
        name: 'REPORTES',
        iconClasses: 'fas fa-chart-bar',        
        children: [
            {
                name: 'Dashboard',
                iconClasses: 'fas fa-chart-pie',
                path: ['/reports/dashboard']
            },
            {
                name: 'Blank',
                iconClasses: 'fas fa-file',
                path: ['/sub-menu-2']
            }
        ]
    },
    {
        name: 'Seguridad',
        iconClasses: 'fas fa-user-shield',        
        children: [
            {
                name: 'Usuarios',
                iconClasses: 'far fa-id-badge',
                path: ['/security/users']
            }
        ]
    }
];
