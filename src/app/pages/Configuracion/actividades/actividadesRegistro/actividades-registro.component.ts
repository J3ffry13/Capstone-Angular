import {Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import {LoginService} from '@services/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import { ActividadesService } from '@services/configuracion/actividades.service';
import { ActividadModel } from '@/Models/configuracion/ActividadModel.model';

@Component({
    selector: 'app-actividades-registro',
    templateUrl: './actividades-registro.component.html',
    styleUrls: ['./actividades-registro.component.scss']
})
export class ActividadesRegistroComponent implements OnInit {

    registro: ActividadModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    loading = true

    validations = {
        codigo: [
            {name: 'required', message: 'El CÓDIGO es requerida'},
            {name: 'min', message: 'Debe ingresar 3 dígitos'}
        ],
        nombre: [{name: 'required', message: 'El NOMBRE DE LA ACTIVIDAD es requerido'}],
    };

    constructor(
        public dialogRef: MatDialogRef<ActividadesRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loginService: LoginService,
        private actividadService: ActividadesService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar
    ) {}


    ngOnInit() {
        this.loading = true;
        this.registro = this.data.registro;
        this.user = this.loginService.getTokenDecoded();
        this.createForm();
    }

    createForm() {
        this.registroForm = this.fb.group({
            codigo: new FormControl(this.registro.codigo + '', [
                Validators.required,
                Validators.min(3)
            ]),
            nombre: new FormControl(
                this.registro.nombre + '',
                Validators.required
            ),
            estado: new FormControl(this.registro.estado)
        });
        this.loading = false;
    }

    getTitle() {
        return this.registro.idActividad == null || this.registro.idActividad == 0
            ? 'Nueva Actividad'
            : 'Editar Actividad: ' +
                  this.registro.nombre +
                  this.registro.idActividad;
    }

    guardarRegistro() {
        let registroDatos: ActividadModel = new ActividadModel();
        registroDatos.clean();
        console.log(registroDatos);
        registroDatos = this.registroForm.getRawValue();
        registroDatos.idActividad = this.registro.idActividad;
        registroDatos.accion = this.registro.idActividad > 0 ? 2 : 1;
        registroDatos.login = this.user.usuarioNombre
        this.actividadService
            .crea_edita_Actividades$({
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
