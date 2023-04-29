import {Component, ViewChild, ChangeDetectorRef, OnInit, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import { Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import { ConfirmActionComponent } from '@components/crud/confirm-action/confirm-action.component';
import { GrupoTrabajoService } from '@services/configuracion/grupoTrabajo.service';
import { GrupoTrabajoModel } from '@/Models/configuracion/GrupoTrabajo.modedel';

@Component({
    selector: 'app-grupostrabajo-listado',
    templateUrl: './gruposTrabajo-listado.component.html',
    styleUrls: ['./gruposTrabajo-listado.component.scss']
})
export class GrupoTrabajoListadoComponent implements OnInit, AfterViewInit {
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
        private grupoTrabajoService: GrupoTrabajoService,
        private loginService: LoginService,
        private router: Router,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
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
        this.grupoTrabajoService
            .listarRegistros$({})
            .subscribe((result) => {
                this.listadoResult = result;
                this.refreshLista();
                this.loading = false;
                this.loadingData = false;
            });
        this.loadingData = false;
    }

    nuevo() {
        const registro = new GrupoTrabajoModel();
        registro.clean();
        this.router.navigate(['masters/workgroup-reg'], {
            state: {
                param: registro,
            }
        });
    }

    edit(registro: GrupoTrabajoModel) {
        this.router.navigate(['masters/workgroup-reg'], {
            state: {
                param: registro,
            }
        });
    }

    delete(registro: any) {
        let registroDatos: GrupoTrabajoModel = new GrupoTrabajoModel();
        registroDatos.clean();
        registroDatos.idGrupo = registro.idGrupo;
        registroDatos.accion = 3;
        registroDatos.login = this.user.usuarioNombre
        const dialogRef = this.dialog.open(ConfirmActionComponent, {
            data: {
                type: 'Eliminar Registro',
                question: '¿Seguro de eliminar el registro?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'ok' && result != undefined) {
                this.grupoTrabajoService
                    .elimina_GruposTrab$({
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
                name: 'codigo',
                label: 'CODIGO',
                esFlag: false,
                width: 'mat-column'
            },    
            {
                name: 'descripcion',
                label: 'DESCRIPCIÓN',
                esFlag: false,
                width: 'mat-column'
            },   
            {
                name: 'supervisor',
                label: 'SUPERVISOR',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'cantidad',
                label: '# PERSONAS',
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

    getItemByHtml(nume: number){
        if (nume == 1) return 'ACTIVO'
        else if (nume == 2) return 'CESADO'
        else return 'SIN CONTRATO'
    } 

     getItemByScss(nume: number){
        if (nume == 1) return 'background-color: green'
        else if (nume == 2) return 'background-color: red'
        else return 'background-color: yellow'
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
                        'LISTADO DE GRUPOS DE TRABAJO',
                        'DATA',
                        this.customColumns.filter(
                            (f) =>
                                f.name !== 'actions' &&
                                f.name !== 'select'
                        ),
                        data,
                        columnsSize,
                        'ListadoGruposTrabajos',
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
