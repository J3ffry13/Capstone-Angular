import {Component, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import {ClientesService} from '@services/dashboard-Maestros/clientes.service';
import {ClientesRegistroComponent} from '../clientesRegistro/clientes-registro.component';
import {ClienteModel} from '@/Models/ClienteModel.model';
import {CurrentUser} from '@/Models/auth/auth.model';
import {LoginService} from '@services/login.service';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';

@Component({
    selector: 'app-clientes-listado',
    templateUrl: './clientes-listado.component.html',
    styleUrls: ['./clientes-listado.component.scss']
})
export class ClientesListadoComponent implements OnInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    customColumns: any[] = [];
    loading = false;
    loadingData = false;
    user: CurrentUser;
    formGroupFiltros: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private ref: ChangeDetectorRef,
        private clientesServices: ClientesService,
        private loginService: LoginService,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.loading = true;
        this.createFrom();
        this.user = this.loginService.getTokenDecoded();
        this.renderColumns();
        this.cargarListaDatos();
    }

    createFrom() {
        this.formGroupFiltros = this.formBuilder.group({
          dni: new FormControl(''),
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
        this.clientesServices
            .listarRegistros$({
                dni: this.formGroupFiltros.value.dni == null ? '' : this.formGroupFiltros.value.dni,
            })
            .subscribe((result) => {
                this.listadoResult = result;
                this.refreshLista();
                console.log(this.loading);
                this.loading = false;
                this.loadingData = false;
            });
        this.loadingData = false;
    }

    nuevo() {
        const registro = new ClienteModel();
        registro.clean();
        this.openDialog(registro);
    }

    edit(registro: ClienteModel) {
        this.openDialog(registro);
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
                this.clientesServices
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

    openDialog(registro: ClienteModel) {
        const dialogRef = this.dialog.open(ClientesRegistroComponent, {
            data: {registro}
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result !== undefined) {
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
                name: 'dni',
                label: 'IDENTIFICACION',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'nombre',
                label: 'NOMBRE',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'apellido',
                label: 'APELLIDO',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'telefono',
                label: 'TELEFONO',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'direccion',
                label: 'DIRECCION',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'estado',
                label: 'ESTADO',
                esFlag: true,
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
