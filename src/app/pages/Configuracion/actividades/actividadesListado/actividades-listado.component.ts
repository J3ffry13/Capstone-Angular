import {
    Component,
    ViewChild,
    ChangeDetectorRef,
    OnInit,
    AfterViewInit
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import {CurrentUser} from '@/Models/auth/auth.model';
import {LoginService} from '@services/login.service';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {ActividadesService} from '@services/configuracion/actividades.service';
import {ActividadModel} from '@/Models/configuracion/ActividadModel.model';
import {ActividadesRegistroComponent} from '../actividadesRegistro/actividades-registro.component';

@Component({
    selector: 'app-actividades-listado',
    templateUrl: './actividades-listado.component.html',
    styleUrls: ['./actividades-listado.component.scss']
})
export class ActividadesListadoComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    customColumns: any[] = [];
    loading = false;
    loadingData = false;
    user: CurrentUser;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private ref: ChangeDetectorRef,
        private actividadesService: ActividadesService,
        private loginService: LoginService,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.loading = true;
        this.user = this.loginService.getTokenDecoded();
        this.renderColumns();
        this.cargarListaDatos();
    }

    ngAfterViewInit(): void {
        this.cargarListaDatos();
    }

    refreshLista() {
        this.dataSource = new MatTableDataSource(this.listadoResult);
        this.loadingData = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ref.markForCheck();
    }

    cargarListaDatos() {
        this.loadingData = true;
        this.actividadesService.listarActividades$({}).subscribe((result) => {
            this.listadoResult = result;
            this.refreshLista();
            this.loading = false;
            this.loadingData = false;
        });
        this.loadingData = false;
    }

    nuevo() {
        const registro = new ActividadModel();
        registro.clean();
        this.openDialog(registro);
    }

    edit(registro: ActividadModel) {
        this.openDialog(registro);
    }

    delete(registro: any) {
        let registroDatos: ActividadModel = new ActividadModel();
        registroDatos.clean();
        registroDatos.idActividad = registro.idActividad;
        registroDatos.accion = 3;
        registroDatos.login = this.user.usuarioNombre;

        const dialogRef = this.dialog.open(ConfirmActionComponent, {
            data: {
                type: 'Eliminar Registro',
                question: '¿Seguro de eliminar el registro?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'ok' && result != undefined) {
                this.actividadesService
                    .elimina_Actividades$({
                        registroDatos
                    })
                    .subscribe((result) => {
                        let message = result[0];
                        this._snackBar.openFromComponent(SnackbarComponent, {
                            duration: 3 * 1000,
                            data: message['']
                        });
                    });
                this.cargarListaDatos();
            }
        });
    }

    openDialog(registro: ActividadModel) {
        const dialogRef = this.dialog.open(ActividadesRegistroComponent, {
            data: {registro}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.cargarListaDatos();
            }
        });
    }

    applyFilterGlobal(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    renderColumns() {
        this.customColumns = [
            {
                name: 'nro',
                label: 'NRO',
                esFlag: false,
                width: 'mat-column  mat-column-60  center-cell'
            },
            {
                name: 'codigo',
                label: 'CODIGO',
                esFlag: false,
                width: 'mat-column  mat-column-60  center-cell'
            },
            {
                name: 'nombre',
                label: 'NOMBRE',
                esFlag: false,
                width: 'mat-column mat-column-60  center-cell'
            },
            {
                name: 'estado',
                label: 'ESTADO',
                esFlag: true,
                width: 'mat-column center-cell'
            },
            {
                name: 'actions',
                label: '...',
                esFlag: false,
                width: 'mat-column center-cell'
            }
        ];
        this.displayedColumns = this.customColumns.map(
            (column: any) => column.name
        );
    }

    exportarDatos() {
        this.asyncAction(this.listadoResult)
            .then(() => {
                this.ref.markForCheck();
            })
            .catch((e: any) => {
                this.ref.markForCheck();
            });
    }

    asyncAction(listaDatos: any[]) {
        let data = listaDatos;
        data.forEach(r => {
            r['estado'] == 1 ? r['estado'] = 'ACTIVO' : r['estado'] = 'INACTIVO'
        })   
        const promise = new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    const columnsSize = [
                        30, 30, 30, 15, 40, 10, 15, 10, 20, 20, 20, 15
                    ];

                    this.excelService.exportToExcelGenerico(
                        'LISTADO DE ACTIVIDADES',
                        'DATA',
                        this.customColumns.filter(
                            (f) =>
                                f.name !== 'indice' &&
                                f.name !== 'actions' &&
                                f.name !== 'select'
                        ),
                        data,
                        columnsSize,
                        'ListadoActividades',
                        true
                    );
                }, 0);
                data.forEach(r => {
                    r['estado'] == 'ACTIVO' ? r['estado'] = true : r['estado'] = false
                })    
            } catch (e) {
                reject(e);
            }
        });
        return promise;
    }
}
