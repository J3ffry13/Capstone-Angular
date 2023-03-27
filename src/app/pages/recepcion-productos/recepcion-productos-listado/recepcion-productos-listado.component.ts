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
import {ClienteModel} from '@/Models/ClienteModel.model';
import {CurrentUser} from '@/Models/auth/auth.model';
import {LoginService} from '@services/login.service';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {ProductosService} from '@services/dashboard-Maestros/productos.service';
import {UtilsService} from '@services/utils/utils.service';
import {RecepcionProductoModel} from '@/Models/procesos/RecepcionProductoModel.model';
import {Router} from '@angular/router';
import {RecepcionProcesosService} from '@services/dashboard-Procesos/recepcion-procesos.service';

@Component({
    selector: 'app-recepcion-productos-listado',
    templateUrl: './recepcion-productos-listado.component.html',
    styleUrls: ['./recepcion-productos-listado.component.scss']
})
export class RecepcionProductosListadoComponent
    implements OnInit, AfterViewInit
{
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    listProveedoresCbo: any[] = [];
    customColumns: any[] = [];
    loading = false;
    loadingData = false;
    user: CurrentUser;
    formGroupFiltros: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private ref: ChangeDetectorRef,
        private recepcionproductosService: RecepcionProcesosService,
        private loginService: LoginService,
        private utilsService: UtilsService,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}

    ngOnInit() {
        this.loading = true;
        this.createFrom();
        this.user = this.loginService.getTokenDecoded();
        this.renderColumns();
    }

    ngAfterViewInit(): void {
        this.utilsService.listadoCombos$({opcion: 1}).subscribe(
            (result) => {
                this.listProveedoresCbo = result[0];
                console.log(this.listProveedoresCbo);
                this.formGroupFiltros.get('proveedores').setValue('');
                this.cargarListaDatos();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    createFrom() {
        this.formGroupFiltros = this.formBuilder.group({
            proveedores: new FormControl('')
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
        let datos = this.formGroupFiltros.value;
        let proveedores =
            datos.proveedores.length > 0
                ? datos.proveedores
                      .map(
                          (item) =>
                              this.listProveedoresCbo.filter(
                                  (prov) => prov.codigo === item
                              )[0].codigo
                      )
                      .join(',')
                : '';
        this.recepcionproductosService
            .listarRegistros$({jsonCodigos: proveedores})
            .subscribe((result) => {
                this.listadoResult = result;
                this.refreshLista();
                this.loading = false;
                this.loadingData = false;
            });
        this.loadingData = false;
    }

    nuevo() {
        const registro = new RecepcionProductoModel();
        registro.clean();
        this.router.navigate(['process/reception/register'], {
            state: {
                param: registro,
                listProveedores: this.listProveedoresCbo
            }
        });
    }

    edit(registro: RecepcionProductoModel) {
        this.router.navigate(['process/reception/register'], {
            state: {
                param: registro,
                listProveedores: this.listProveedoresCbo
            }
        });
    }

    getIP = async () => {
        return await fetch('https://api.ipify.org?format=json').then(
            (response) => response.json()
        );
    };

    delete(registro: any) {
        let registroDatos: ClienteModel = new ClienteModel();
        registroDatos.clean();
        registroDatos.idCliente = registro.idCliente;
        registroDatos.accion = 3;
        (registroDatos.login = this.user.usuarioNombre),
            this.getIP().then((response) => {
                registroDatos.host = response.ip;
            });
        const dialogRef = this.dialog.open(ConfirmActionComponent, {
            data: {
                type: 'Eliminar Registro',
                question: '¿Seguro de eliminar el registro?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'ok' && result != undefined) {
                this.recepcionproductosService
                    .elimina_Clientes$({
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
                name: 'codigoProducto',
                label: 'CODIGO',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'nombreProducto',
                label: 'NOMBRE',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'descripcionProducto',
                label: 'DESCRIPCION',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'fechaRecepcion',
                label: 'FECHA R.',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'stock',
                label: 'STOCK',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'precio',
                label: 'PRECIO',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'nombreProveedor',
                label: 'PROVEEDOR',
                esFlag: false,
                width: 'mat-column mat-column-100 center-cell'
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

    // asyncAction() {
    //   const promise = new Promise((resolve, reject) => {
    //     try {
    //       setTimeout(() => {
    //         const columnsSize = [
    //           15, 30, 30, 30, 15, 40, 10, 15, 25, 25, 20, 20, 20, 15,
    //         ];

    //         this.excelService.exportToExcelGenerico(
    //           'REPORTES DE PROVEEDORES',
    //           'DATA',
    //           this.customColumns.filter((f) => f.name !== 'actions'),
    //           this.listadoResult,
    //           columnsSize,
    //           'RptProveedores'
    //         );
    //       }, 0);
    //     } catch (e) {
    //       reject(e);
    //     }
    //   });
    //   return promise;
    // }

    exportarDatos() {
        // this.asyncAction()
        //   .then(() => {
        //     this.ref.markForCheck();
        //   })
        //   .catch((e: any) => {
        //     console.log(e);
        //     this.ref.markForCheck();
        //   });
    }
}
