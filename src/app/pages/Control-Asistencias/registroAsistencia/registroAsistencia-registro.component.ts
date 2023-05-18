import {Component, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import {LoginService} from '@services/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonaModel} from '@/Models/configuracion/PersonaModel.model';
import {Storage, ref, getDownloadURL} from '@angular/fire/storage';
import {RegistroAsistenciasService} from '@services/asistencias/registroAsistencias.service';
import moment from 'moment';
import { RegistroMarcacion } from '@/Models/asistencias/ActividadModel.model';
import { SnackbarComponent } from '@components/crud/snackbar/snackbar.component';

@Component({
    selector: 'app-registroasistencia-registro',
    templateUrl: './registroAsistencia-registro.component.html',
    styleUrls: ['./registroAsistencia-registro.component.scss']
})
export class RegistroAsistenciaRegistroComponent implements OnInit {
    registro: PersonaModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    listTipoMarcacion: any[] = [];
    loading = true;
    load = false;
    imageBase64 = 'assets/img/no_disponible.jpg';
    imageBase64Init = '';
    fechaActual = '';
    persona: any; 

    validations = {
        documento: [
            {name: 'required', message: 'El DOCUMENTO es requerido'},
            {name: 'min', message: 'Debe ingresar 8 dígitos como mínimo'}
        ],
        nombres: [{name: 'required', message: 'El NOMBRE es requerido'}],
        f_nacimiento: [
            {name: 'required', message: 'La FECHA DE NACIMIENTO es requerida'}
        ],
        idTipo: [{name: 'min', message: 'El TIPO DE Marcación es requerido'}]
    };

    constructor(
        private loginService: LoginService,
        private fb: FormBuilder,
        private ref: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        private registroAsistenciasService: RegistroAsistenciasService,
        private storage: Storage
    ) {}

    ngOnInit() {
        this.loading = true;
        this.user = this.loginService.getTokenDecoded();
        this.createForm();
        this.updateFecha();
        setInterval(() => this.updateFecha(), 120000); // 2 min
        this.loading = false;
    }

    buscarTrabajador() {
        console.log('sdf');
        this.load = true;
        this.registroAsistenciasService
            .obtenerTrabajador$({
                dni: this.registroForm.getRawValue().documento
            })
            .subscribe(
                (result) => {
                    this.persona = result[0];
                    if (this.persona !== undefined) {
                        this.registroForm.controls['nombres'].setValue(
                            this.persona.nombreC
                        );
                        this.registroForm.controls['f_nacimiento'].setValue(
                            moment(this.persona.fechaNa, 'DD/MM/YYYY')
                        );
                        if (this.persona.urlImagen.length > 0) {
                            this.getImagenenPersona(this.persona.urlImagen);
                        }
                    }
                },
                (error) => {
                    this.load = false;
                    console.log(error);
                }
            );

        this.load = false;
    }

    updateFecha() {
        moment.locale('es');
        this.fechaActual = moment()
            .format('dddd, DD [de] MMMM [del] YYYY')
            .toLocaleUpperCase();
        this.ref.markForCheck();
    }

    getImagenenPersona(registro: string) {
        this.load = true;
        let x = getDownloadURL(ref(this.storage, `imagenes/${registro}`))
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();
                this.imageBase64 = url;
                this.load = false;
            })
            .catch((error) => {
                console.log(error);
                this.load = false;
            });
    }

    createForm() {
        this.listTipoMarcacion.push({codigo: 1, descripcion: 'ENTRADA'});
        this.listTipoMarcacion.push({codigo: 2, descripcion: 'SALIDA'});

        this.registroForm = this.fb.group({
            documento: new FormControl('', ),
            nombres: new FormControl(
                {value: '', disabled: true},
                [Validators.required,]
            ),
            f_nacimiento: [{value: '', disabled: true}, Validators.required],
            idTipo: new FormControl(-1 + '', [Validators.min(1)])
        });
        this.loading = false;
    }

    cleanRegister() {
        this.registroForm.controls['documento'].setValue('')
        this.registroForm.controls['nombres'].setValue('')
        this.registroForm.controls['f_nacimiento'].setValue('')
        this.registroForm.controls['idTipo'].setValue('-1')
    }

    getTitle() {
        return 'Registro Asistencias';
    }

    guardarRegistro() {
        if(this.persona !== undefined) {
            let registroDatos: RegistroMarcacion = new RegistroMarcacion();
            registroDatos.clean();
            registroDatos = this.registroForm.getRawValue();
            registroDatos.idRegAsistencia = 0
            registroDatos.idPersona = this.persona.idPersona;
            registroDatos.accion = 1;
            registroDatos.login = this.user.usuarioNombre;
            this.registroAsistenciasService
            .crea_edita_RegistroAsistencia$({
                registroDatos
            })
            .subscribe((result) => {
                let message = result[0];
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: message['']
                });
            });           
        } else {
            this._snackBar.openFromComponent(SnackbarComponent, {
                duration: 5 * 1000,
                data: 'El trabajador no existe, por favor ingrese otro documento o presione buscar.'
            });
        }
        this.cleanRegister()
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
