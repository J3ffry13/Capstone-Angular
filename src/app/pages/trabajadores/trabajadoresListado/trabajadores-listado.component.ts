import {Component, ViewChild, ChangeDetectorRef, OnInit,
    AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import {CurrentUser} from '@/Models/auth/auth.model';
import {LoginService} from '@services/login.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import { TrabajadoresService } from '@services/configuracion/trabajadores.service';
import { PersonaModel } from '@/Models/configuracion/PersonaModel.model';
import { Router } from '@angular/router';
import { UtilsService } from '@services/utils/utils.service';

@Component({
    selector: 'app-trabajadores-listado',
    templateUrl: './trabajadores-listado.component.html',
    styleUrls: ['./trabajadores-listado.component.scss']
})
export class TrabajadoresListadoComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    listTipoDoccbo: any[] = [];
    listTipoContcbo: any[] = [];
    customColumns: any[] = [];
    loading = false;
    loadingData = false;
    user: CurrentUser;
    formGroupFiltros: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private ref: ChangeDetectorRef,
        private trabajadorService: TrabajadoresService,
        private loginService: LoginService,
        private router: Router,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private utilsService: UtilsService,
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
        this.utilsService.listadoCombos$({opcion: 1}).subscribe(
            (result) => {
                this.listTipoDoccbo = result[0];
                this.listTipoContcbo = result[1];
                this.cargarListaDatos();
            },
            (error) => {
                console.log(error);
            }
        );
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
        this.trabajadorService
            .listarRegistros$({
                dni: this.formGroupFiltros.value.dni == null ? '' : this.formGroupFiltros.value.dni,
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
        const registro = new PersonaModel();
        registro.clean();
        this.router.navigate(['masters/workers-reg'], {
            state: {
                param: registro,
                listTipoContcbo: this.listTipoContcbo,
                listTipoDoccbo: this.listTipoDoccbo,
            }
        });
    }

    edit(registro: PersonaModel) {
        this.router.navigate(['masters/workers-reg'], {
            state: {
                param: registro,
                listTipoContcbo: this.listTipoContcbo,
                listTipoDoccbo: this.listTipoDoccbo,
            }
        });
    }

    getIP = async () => {
        return await fetch('https://api.ipify.org?format=json').then(
            (response) => response.json()
        );
    };

    // delete(registro: any) {
    //     let registroDatos: ProveedorModel = new ProveedorModel();
    //     registroDatos.clean();
    //     registroDatos.idProveedor = registro.idProveedor;
    //     registroDatos.accion = 3;
    //     (registroDatos.login = this.user.usuarioNombre),
    //         this.getIP().then((response) => {
    //             registroDatos.host = response.ip;
    //         });
    //     const dialogRef = this.dialog.open(ConfirmActionComponent, {
    //         data: {
    //             type: 'Eliminar Registro',
    //             question: '¿Seguro de eliminar el registro?'
    //         }
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         if (result == 'ok' && result != undefined) {
    //             this.proveedoresService
    //                 .elimina_Proveedores$({
    //                     registroDatos
    //                 })
    //                 .subscribe((result) => {
    //                     let message = result[0];
    //                     this._snackBar.openFromComponent(SnackbarComponent, {
    //                         duration: 3 * 1000,
    //                         data: message['']
    //                     });
    //                 });
    //             this.cargarListaDatos();
    //         }
    //     });
    // }

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
                name: 'tipoDocumento',
                label: 'T. DOCUMENTO',
                esFlag: false,
                width: 'mat-column'
            },    
            {
                name: 'dni',
                label: 'DOCUMENTO',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'nombres',
                label: 'NOMBRES',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },  
             {
                name: 'apellidos',
                label: 'APELLIDOS',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },      
            {
                name: 'f_nacimiento',
                label: 'F. NACIMIENTO',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'estadoTrab',
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
    

    exportarDatos() {   }
}
