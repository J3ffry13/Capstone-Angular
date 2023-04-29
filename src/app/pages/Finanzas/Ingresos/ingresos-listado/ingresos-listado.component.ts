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
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {UtilsService} from '@services/utils/utils.service';
import {LoginService} from '@services/login.service';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import moment from 'moment';
import {IngresosService} from '@services/finanzas/ingresos.service';
import {IngresosModel} from '@/Models/finanzas/IngresosModel.model';
import {IngresosRegistroComponent} from '../ingresos-registro/ingresos-registro.component';

@Component({
    selector: 'app-ingresos-listado',
    templateUrl: './ingresos-listado.component.html',
    styleUrls: ['./ingresos-listado.component.scss']
})
export class IngresosListadoComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    customColumns: any[] = [];
    loading = false;
    loadingData = false;
    user: CurrentUser;
    maxDate = new Date();
    formGroupFiltros: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private ref: ChangeDetectorRef,
        private ingresosService: IngresosService,
        private loginService: LoginService,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.loading = true;
        this.user = this.loginService.getTokenDecoded();
        this.createFrom();
        this.renderColumns();
        this.cargarListaDatos();
    }

    ngAfterViewInit(): void {
        this.cargarListaDatos();
    }

    createFrom() {
        this.formGroupFiltros = this.formBuilder.group({
            fechaIni: new FormControl(moment().add(-1, 'days')),
            fechaFin: new FormControl(moment())
        });
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
        const controls = this.formGroupFiltros.controls;
        this.ingresosService
            .listarIngresos$({
                fechaIni: moment(controls['fechaIni'].value).format(
                    'YYYY-MM-DD'
                ),
                fechaFin: moment(controls['fechaFin'].value).format(
                    'YYYY-MM-DD'
                )
            })
            .subscribe((result) => {
                this.listadoResult = result;
                this.refreshLista();
                this.loading = false;
                this.loadingData = false;
            });
        this.loadingData = false;
    }

    nuevo() {
        const registro = new IngresosModel();
        registro.clean();
        this.openDialog(registro);
    }

    edit(registro: IngresosModel) {
        this.openDialog(registro);
    }

    openDialog(registro: IngresosModel) {
        const dialogRef = this.dialog.open(IngresosRegistroComponent, {
            data: {registro}
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result) {
                this.cargarListaDatos();
            }
        });
    }

    delete(registro: any) {
        let registroDatos: IngresosModel = new IngresosModel();
        registroDatos.clean();
        registroDatos.idIngresos = registro.idIngresos;
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
                this.ingresosService
                    .elimina_Ingresos$({
                        registroDatos
                    })
                    .subscribe((result) => {
                        let message = result[0];
                        this._snackBar.openFromComponent(SnackbarComponent, {
                            duration: 3 * 1000,
                            data: message['']
                        });
                        this.cargarListaDatos();
                    });
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
                width: 'mat-column mat-column-60 center-cell'
            },
            {
                name: 'descripcion',
                label: 'DESCRIPCIÓN',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'monto',
                label: 'MONTO',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'fecha',
                label: 'FECHA',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'actions',
                label: '...',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
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
        const promise = new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    const columnsSize = [
                        20, 30, 30, 40, 40, 10, 15, 10, 20, 20, 20, 15
                    ];

                    this.excelService.exportToExcelGenerico(
                        'LISTADO DE INGRESOS',
                        'DATA',
                        this.customColumns.filter(
                            (f) =>
                                f.name !== 'indice' &&
                                f.name !== 'actions' &&
                                f.name !== 'select'
                        ),
                        data,
                        columnsSize,
                        'ListadoIngresos',
                        true
                    );
                }, 0);
            } catch (e) {
                reject(e);
            }
        });
        return promise;
    }
}
