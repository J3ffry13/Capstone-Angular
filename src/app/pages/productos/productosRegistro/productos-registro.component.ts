import {Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import {ClienteModel} from '@/Models/ClienteModel.model';
import {LoginService} from '@services/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {ClientesService} from '@services/dashboard-Maestros/clientes.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';

@Component({
    selector: 'app-productos-registro',
    templateUrl: './productos-registro.component.html',
    styleUrls: ['./productos-registro.component.scss']
})
export class ProductosRegistroComponent implements OnInit {
    registro: ClienteModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    loading = true

    validations = {
        dni: [
            {name: 'required', message: 'La Identificación es requerida'},
            {name: 'min', message: 'Debe ingresar 8 dígitos'}
        ],
        nombre: [{name: 'required', message: 'El NOMBRE es requerido'}],
        apellido: [{name: 'required', message: 'El APELLIDO es requerido'}],
        telefono: [
            {name: 'required', message: 'El TELEFONO es requerido'},
            {name: 'min', message: 'Debe ingresar 9 dígitos'}
        ],
        direccion: [{name: 'required', message: 'El DIRECCION es requerido'}]
    };

    constructor(
        public dialogRef: MatDialogRef<ProductosRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loginService: LoginService,
        private clientesServices: ClientesService,
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
            dni: new FormControl(this.registro.dni + '', [
                Validators.required,
                Validators.min(8)
            ]),
            nombre: new FormControl(
                this.registro.nombre + '',
                Validators.required
            ),
            apellido: new FormControl(
                this.registro.apellido + '',
                Validators.required
            ),
            telefono: new FormControl(this.registro.telefono + '', [
                Validators.required,
                Validators.min(8)
            ]),
            direccion: new FormControl(
                this.registro.direccion + '',
                Validators.required
            ),
            estado: new FormControl(this.registro.estado)
        });
        this.loading = false;
    }

    getTitle() {
        return this.registro.idCliente == null || this.registro.idCliente == 0
            ? 'Nuevo Proveedor'
            : 'Editar Proveedor: ' +
                  this.registro.nombre +
                  this.registro.idCliente;
    }

    getIP = async () => {
        return await fetch('https://api.ipify.org?format=json').then(
            (response) => response.json()
        );
    };

    guardarRegistro() {
        let registroDatos: ClienteModel = new ClienteModel();
        registroDatos.clean();
        registroDatos = this.registroForm.getRawValue();
        registroDatos.idCliente = this.registro.idCliente;
        registroDatos.estadon = this.registroForm.value.estado ? 1 : 0;
        registroDatos.accion = this.registro.idCliente > 0 ? 2 : 1;
        (registroDatos.login = this.user.usuarioNombre),
            this.getIP().then((response) => {
                registroDatos.host = response.ip;
            });
        this.clientesServices
            .crea_edita_Clientes$({
                registroDatos
            })
            .subscribe((result) => {
                let message = result[0];
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: message['']
                });
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
