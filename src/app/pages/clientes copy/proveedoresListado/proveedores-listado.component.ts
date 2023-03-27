import {Component, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core';
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
import { ProveedoresRegistroComponent } from '../proveedoresRegistro/proveedores-registro.component';
import { ProveedoresService } from '@services/dashboard-Maestros/proveedores.service';
import { ProveedorModel } from '@/Models/ProveedorModel.model';

@Component({
    selector: 'app-proveedores-listado',
    templateUrl: './proveedores-listado.component.html',
    styleUrls: ['./proveedores-listado.component.scss']
})
export class ProveedoresListadoComponent implements OnInit {
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
        private proveedoresService: ProveedoresService,
        private loginService: LoginService,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.loading = true;
        this.user = this.loginService.getTokenDecoded();
        this.renderColumns();
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
        this.proveedoresService
            .listarRegistros$({
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
        const registro = new ProveedorModel();
        registro.clean();
        this.openDialog(registro);
    }

    edit(registro: ProveedorModel) {
        this.openDialog(registro);
    }

    getIP = async () => {
        return await fetch('https://api.ipify.org?format=json').then(
            (response) => response.json()
        );
    };

    delete(registro: any) {
        let registroDatos: ProveedorModel = new ProveedorModel();
        registroDatos.clean();
        registroDatos.idProveedor = registro.idProveedor;
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
                this.proveedoresService
                    .elimina_Proveedores$({
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

    openDialog(registro: ProveedorModel) {
        const dialogRef = this.dialog.open(ProveedoresRegistroComponent, {
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
                name: 'ruc',
                label: 'RUC',
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
                name: 'correo',
                label: 'CORREO',
                esFlag: false,
                width: 'mat-column'
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

    exportarDatos() {   }
}
