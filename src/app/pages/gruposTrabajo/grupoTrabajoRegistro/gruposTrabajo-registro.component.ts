import {ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Component, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit, AfterViewInit} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {LoginService} from '@services/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {GrupoTrabajoService} from '@services/configuracion/grupoTrabajo.service';
import {GrupoTrabajoModel} from '@/Models/configuracion/GrupoTrabajo.modedel';
import {Observable} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
    selector: 'app-grupostrabajo-registro',
    templateUrl: './gruposTrabajo-registro.component.html',
    styleUrls: ['./gruposTrabajo-registro.component.scss']
})
export class GrupoTrabajoRegistroComponent implements OnInit, AfterViewInit {
    registro: GrupoTrabajoModel = new GrupoTrabajoModel();
    registroForm: FormGroup;
    user: CurrentUser;
    listSupervisores: any[] = [];
    FilteredlistSupervisores: Observable<any[]>;
    loading = true;
    dataSource: MatTableDataSource<any>;
    dataSourceSelec: MatTableDataSource<any>;
    listadoResult: any[] = [];
    listadoResultSelect: any[] = [];
    customColumns: any[] = [];
    customColumnsSelect: any[] = [];

    displayedColumns = ['select', 'dni', 'nombreC', 'actions'];
    displayedColumnsSel = ['select', 'dni', 'nombreC', 'actions'];
    selectionDisponible = new SelectionModel<any>(true, []);
    selectionAsignado = new SelectionModel<any>(true, []);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginatorSelec: MatPaginator;
    @ViewChild(MatSort) sortSelect: MatSort;
    pageSizeOptions: any[] = [30, 40, 50];

    validations = {
        codigo: [
            {name: 'required', message: 'El CODIGO DEL GRUPO es requerido'},
            {name: 'min', message: 'Debe ingresar 3 dígitos como mínimo'}
        ],
        descripcion: [
            {name: 'required', message: 'La DESCRIPCIÓN es requerida'}
        ],
        supervisorNombre: [
            {
                name: 'required',
                message: 'El SUPERVISOR es requerido es requerido'
            }
        ]
    };

    constructor(
        private loginService: LoginService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private ref: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        private grupoTrabajoService: GrupoTrabajoService
    ) {}

    ngOnInit() {
        this.registro.clean();
        this.loading = true;
        this.activatedRoute.paramMap
            .pipe(map(() => window.history.state))
            .subscribe((data) => {
                if (data.param) {
                    this.registro = data.param;
                } else {
                    this.loading = false;
                    this.router.navigate(['masters/workgroup']);
                }
            });
        this.user = this.loginService.getTokenDecoded();
        this.createForm();
    }

    ngAfterViewInit(): void {
        this.loading = true;
        this.grupoTrabajoService
            .obtenerTrabajadores$({idGrupo: this.registro.idGrupo})
            .subscribe(
                (result) => {
                    this.listSupervisores = result[0];
                    if (this.registro.idSupervisor > 0) {
                        let nombre = this.listSupervisores.find(
                            (x) => x.idPersona == this.registro.idSupervisor
                        );
                        this.registroForm.controls['supervisorNombre'].setValue(
                            nombre.nombreC !== undefined ? nombre.nombreC : ''
                        );
                    }
                    this.listadoResult = result[0];
                    this.listadoResultSelect = result[1];
                    this.refreshDataSourceDisponible();
                    this.refreshDataSourceAsignado();
                },
                (error) => {
                    this.loading = false;
                    console.log(error);
                }
            );

        this.loading = false;
    }

    createForm() {
        this.registroForm = this.fb.group({
            codigo: new FormControl(this.registro.codigo + '', [
                Validators.required,
                Validators.minLength(3)
            ]),
            descripcion: new FormControl(
                this.registro.descripcion + '',
                Validators.required
            ),
            idSupervisor: new FormControl(
                this.registro.idSupervisor + '',
                Validators.min(1)
            ),
            supervisorNombre: new FormControl(
                this.registro.supervisorNombre + '',
                Validators.required
            )
        });
        this.loading = false;
        this.FilteredlistSupervisores = this.registroForm.controls[
            'supervisorNombre'
        ].valueChanges.pipe(
            startWith(''),
            map((value) => {
                return this._filter(value);
            })
        );
    }

    agregarTrabajadaor(trabajador: any, unitario: boolean) {
        if (trabajador && unitario) {
            this.listadoResultSelect.push(trabajador);
            const idx = this.listadoResult.findIndex(
                (f) => f.idPersona === trabajador.idPersona
            );
            this.listadoResult.splice(idx, 1);
        } else {
            if (this.selectionDisponible.selected.length === 0) {
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: 'No existe ningún trabajador seleccionado.'
                });
            }
            this.selectionDisponible.selected.forEach((trab) => {
                this.listadoResultSelect.push(trab);
                const idx = this.listadoResult.findIndex(
                    (f) => f.trabajadorID === trab.trabajadorID
                );
                this.listadoResult.splice(idx, 1);
            });
        }
        this.refreshDataSourceDisponible();
        this.refreshDataSourceAsignado();
    }

    quitarTrabajadaor(trabajador: any, unitario: boolean) {
        if (trabajador && unitario) {
            this.listadoResult.push(trabajador);
            const idx = this.listadoResultSelect.findIndex(
                (f) => f.idPersona === trabajador.idPersona
            );
            this.listadoResultSelect.splice(idx, 1);
        } else {
            if (this.selectionAsignado.selected.length === 0) {
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: 'No existe ningún trabajador seleccionado.'
                });
            }
            this.selectionAsignado.selected.forEach((trab) => {
                this.listadoResult.push(trab);
                const idx = this.listadoResultSelect.findIndex(
                    (f) => f.trabajadorID === trab.trabajadorID
                );
                this.listadoResultSelect.splice(idx, 1);
            });
        }
        this.refreshDataSourceDisponible();
        this.refreshDataSourceAsignado();
    }

    displayFn(x: any): string {
        return x && x.nombreC ? x.nombreC : '';
    }

    private _filter(x: any): any[] {
        const filterValue = x.toLowerCase();
        return this.listSupervisores.filter((y) =>
            y.nombreC.toLowerCase().includes(filterValue)
        );
    }

    masterToggleDisponible() {
        if (
            this.isAllSelectedDisponible() ||
            this.selectionDisponible.selected.length > 0
        ) {
            this.selectionDisponible.clear();
        } else {
            if (this.dataSource.filteredData.length > 0) {
                this.selectionDisponible.clear();
                this.listadoResult.forEach((row) => {
                    if (
                        this.dataSource.filteredData.filter(
                            (x) => x.idPersona === row.idPersona
                        ).length > 0
                    ) {
                        this.selectionDisponible.select(row);
                    }
                });
            } else {
                this.listadoResult.forEach((row) =>
                    this.selectionDisponible.select(row)
                );
            }
        }
    }

    isAllSelectedDisponible() {
        const numSelected = this.selectionDisponible.selected.length;
        const numRows = this.listadoResult.length;
        return numSelected === numRows;
    }

    isAllFilterSelectedDisponible() {
        const numSelected = this.selectionDisponible.selected.length;
        const numRows = this.dataSource.filteredData.length;
        return numSelected === numRows;
    }

    applyFilterGlobal(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    masterToggleAsignado() {
        if (
            this.isAllSelectedSelecccionado() ||
            this.selectionAsignado.selected.length > 0
        ) {
            this.selectionAsignado.clear();
        } else {
            if (this.dataSourceSelec.filteredData.length > 0) {
                this.selectionAsignado.clear();
                this.listadoResultSelect.forEach((row) => {
                    if (
                        this.dataSourceSelec.filteredData.filter(
                            (x) => x.idPersona === row.idPersona
                        ).length > 0
                    ) {
                        this.selectionAsignado.select(row);
                    }
                });
            } else {
                this.listadoResultSelect.forEach((row) =>
                    this.selectionAsignado.select(row)
                );
            }
        }
    }

    isAllSelectedSelecccionado() {
        const numSelected = this.selectionAsignado.selected.length;
        const numRows = this.listadoResultSelect.length;
        return numSelected === numRows;
    }

    isAllFilterSelectedSeleccionado() {
        const numSelected = this.selectionAsignado.selected.length;
        const numRows = this.dataSourceSelec.filteredData.length;
        return numSelected === numRows;
    }

    applyFilterGlobalSeleccionado(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceSelec.filter = filterValue;
    }

    getTitle() {
        return this.registro.idGrupo == null || this.registro.idGrupo == 0
            ? 'Nuevo Grupo de Trabajo'
            : 'Editar Grupo de Trabajo: ' +
                  this.registro.codigo +
                  ' ' +
                  this.registro.descripcion;
    }

    getItemByHtml(nume: number) {
        if (nume == 1) return 'ACTIVO';
        else if (nume == 2) return 'CESADO';
        else return 'SIN CONTRATO';
    }

    getItemByScss(nume: number) {
        if (nume == 1) return 'background-color: green';
        else if (nume == 2) return 'background-color: red';
        else return 'background-color: yellow';
    }

    delete(registro: any) {
        const dialogRef = this.dialog.open(ConfirmActionComponent, {
            data: {
                type: 'Eliminar Registro',
                question: '¿Seguro de eliminar el registro?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'ok' && result != undefined) {
                registro.status = false;
                // this.refreshLista();
            }
        });
    }

    refreshDataSourceDisponible() {
        this.loading = true;
        this.dataSource = new MatTableDataSource(this.listadoResult);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.selectionDisponible = new SelectionModel<any>(true, []);
        this.loading = false;
    }

    refreshDataSourceAsignado() {
        this.loading = true;
        this.dataSourceSelec = new MatTableDataSource(this.listadoResultSelect);
        this.dataSourceSelec.paginator = this.paginatorSelec;
        this.dataSourceSelec.sort = this.sortSelect;
        this.selectionAsignado = new SelectionModel<any>(true, []);
        this.loading = false;
    }

    guardarRegistro() {
        let registroDatos: GrupoTrabajoModel = new GrupoTrabajoModel();
        registroDatos.clean();
        registroDatos = this.registroForm.getRawValue();
        registroDatos.idGrupo = this.registro.idGrupo;
        registroDatos.accion = this.registro.idGrupo > 0 ? 2 : 1;
        registroDatos.login = this.user.usuarioNombre;
        registroDatos.trabajadores = JSON.stringify(this.listadoResult);
        console.log(registroDatos);
        // this.grupoTrabajoService
        //     .crea_edita_GruposTrab$({
        //         registroDatos
        //     })
        //     .subscribe((result) => {
        //         let message = result[0];
        //         this._snackBar.openFromComponent(SnackbarComponent, {
        //             duration: 3 * 1000,
        //             data: message['']
        //         });
        //         this.router.navigate(['/masters/workgroup']);
        //     });
    }

    getError(controlName: string): string {
        let error = '';
        const control = this.registroForm.get(controlName);
        if (control.touched && control.errors !== null) {
            const json: string = JSON.stringify(control.errors);
            this.validations[controlName].forEach((e) => {
                if (json.includes(e.name)) {
                    error = e.message;
                }
            });
        }
        return error;
    }
}
