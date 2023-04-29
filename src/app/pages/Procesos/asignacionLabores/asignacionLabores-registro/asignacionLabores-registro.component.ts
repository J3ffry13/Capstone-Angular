import {AfterViewInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import {LoginService} from '@services/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {AsignacionLaboresService} from '@services/procesos/asignacionLabores.service';
import {AsignacionLaboresModel} from '@/Models/procesos/AsignacionLaboresModel.model';
import {UtilsService} from '@services/utils/utils.service';
import moment from 'moment';

@Component({
    selector: 'app-asignacionlabores-registro',
    templateUrl: './asignacionLabores-registro.component.html',
    styleUrls: ['./asignacionLabores-registro.component.scss']
})
export class AsignacionLaboresRegistroComponent
    implements OnInit, AfterViewInit
{
    registro: AsignacionLaboresModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    loading = true;
    listActividadesCbo: any[] = [];
    listGrupoTrabCbo: any[] = [];

    validations = {
        idActividad: [{name: 'min', message: 'Debe seleccionar una Actividad'}],
        idGrupo: [{name: 'min', message: 'Debe seleccionar un Grupo de Trab.'}],
        descripcion: [{name: 'required', message: 'La Descripción es requerida'}],
        direccion: [{name: 'required', message: 'La Direccion es requerida'}],
        fecha: [{name: 'required', message: 'La Fecha es requerida'}],
        backgroundColor: [{name: 'required', message: 'El color es requerido'}],
    };

    constructor(
        public dialogRef: MatDialogRef<AsignacionLaboresRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loginService: LoginService,
        private utilsService: UtilsService,
        private asigancionLabores: AsignacionLaboresService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.registro = this.data.registro;
        this.loading = true;
        this.registro = this.data.registro;
        this.user = this.loginService.getTokenDecoded();
        this.createForm();
    }

    ngAfterViewInit(): void {
        this.loading = true;
        this.utilsService.listadoCombos$({opcion: 2}).subscribe(
            (result) => {
                this.listActividadesCbo = result[0];
                this.listGrupoTrabCbo = result[1];
                this.loading = false;
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    createForm() {
        this.registroForm = this.fb.group({
            idActividad: new FormControl(
                this.registro.idActividad + '',
                Validators.min(1)
            ),
            idGrupo: new FormControl(
                this.registro.idGrupo + '',
                Validators.min(1)
            ),
            descripcion: new FormControl(
                this.registro.descripcion + '',
                Validators.required
            ),
            direccion: new FormControl(
                this.registro.direccion + '',
                Validators.required
            ),
            fecha: [{value: '', disabled: true}, Validators.required],
            backgroundColor: new FormControl(
                this.registro.backgroundColor + '',
                Validators.required
            ),
            start: new FormControl('',
                Validators.required
            ),
            end: new FormControl('',
                Validators.required
            ),
        });
        if (this.registro.idAsignacion > 0) {
            let fechaI = new Date(this.registro.start)
            let fechaF = new Date(this.registro.end)
            this.registroForm.controls['start'].setValue((fechaI.getHours() > 10 ? '': '0') + fechaI.getHours() + ':' + (fechaI.getMinutes() > 10 ? '': '0') + fechaI.getMinutes())
            this.registroForm.controls['end'].setValue((fechaF.getHours() > 10 ? '': '0') + fechaF.getHours() + ':' + (fechaF.getMinutes() > 10 ? '': '0') + fechaF.getMinutes())
           
        } else {
            this.registroForm.controls['start'].setValue('00:00')
            this.registroForm.controls['end'].setValue('00:00')
        }
        let fecha = new Date(this.registro.fecha)
        this.registroForm.controls['fecha'].setValue(
            moment(fecha, 'DD/MM/YYYY').add(1, 'days')
        );
        // this.loading = false;
    }

    getTitle() {
        return this.registro.idAsignacion == null ||
            this.registro.idAsignacion == 0
            ? 'Nueva Asignación de Labores'
            : 'Editar Asignación: ' + this.registro.title;
    }

    compareDateToCurrent(controls: any): boolean {
            const inicio = moment(controls['fecha'].value).format('DD/MM/YYYY') + ' ' + controls['start'].value
            const fin = moment(controls['fecha'].value).format('DD/MM/YYYY') + ' ' + controls['end'].value
            if (inicio > fin || inicio == fin) {
                return true;
            } else {
                return false;
            }
    }

    guardarRegistro() {
        const controls = this.registroForm.controls;
        if (this.compareDateToCurrent(controls)){
            this._snackBar.openFromComponent(SnackbarComponent, {
                duration: 3 * 1000,
                data: 'El registro no pudo ser procesador, la hora fin debe ser mayor a la hora inicio.'
            });
            this.dialogRef.close();
        }else{
            let registroDatos: AsignacionLaboresModel = new AsignacionLaboresModel();
            registroDatos.clean();
            registroDatos.idAsignacion = this.registro.idAsignacion
            registroDatos.idActividad =  +controls['idActividad'].value
            registroDatos.idGrupo =  +controls['idGrupo'].value
            registroDatos.descripcion =  controls['descripcion'].value
            registroDatos.direccion =  controls['direccion'].value
            registroDatos.inicio =  moment(controls['fecha'].value).format('YYYY-MM-DD') + ' ' + controls['start'].value
            registroDatos.final =  moment(controls['fecha'].value).format('YYYY-MM-DD') + ' ' + controls['end'].value
            registroDatos.backgroundColor =  controls['backgroundColor'].value
            registroDatos.accion = this.registro.idActividad > 0 ? 2 : 1;
            registroDatos.login = this.user.usuarioNombre
            this.asigancionLabores
            .crea_edita_Asignaciones$({
                registroDatos
            })
            .subscribe((result) => {
                let message = result[0];
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: message['']
                });
                this.dialogRef.close({ result: true , close: false });
            });
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
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
