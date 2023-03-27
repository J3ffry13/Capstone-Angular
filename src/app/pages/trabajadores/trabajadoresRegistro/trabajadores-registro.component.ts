import {Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component,ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import {LoginService} from '@services/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import { ProveedoresService } from '@services/dashboard-Maestros/proveedores.service';
import { ProveedorModel } from '@/Models/ProveedorModel.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaModel } from '@/Models/configuracion/PersonaModel.model';

@Component({
    selector: 'app-trabajadores-registro',
    templateUrl: './trabajadores-registro.component.html',
    styleUrls: ['./trabajadores-registro.component.scss']
})
export class TrabajadoresRegistroComponent implements OnInit {
    registro: PersonaModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    listTipoDoccbo: any[] = [];
    listTipoContcbo: any[] = [];
    loading = true;
    imageBase64 = 'assets/img/default_trabajador.png';
    imageBase64Init = '';
    file: any

    validations = {
        ruc: [
            {name: 'required', message: 'La Identificación es requerida'},
            {name: 'min', message: 'Debe ingresar 11 dígitos'}
        ],
        nombre: [{name: 'required', message: 'El NOMBRE es requerido'}],
        correo: [{name: 'required', message: 'El CORREO es requerido'}],
        telefono: [
            {name: 'required', message: 'El TELEFONO es requerido'},
            {name: 'min', message: 'Debe ingresar 9 dígitos'}
        ],
        direccion: [{name: 'required', message: 'El DIRECCION es requerido'}]
    };

    constructor(
        private loginService: LoginService,
        private fb: FormBuilder,
        private ref: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.loading = true;
        // this.registro = this.data.registro;
        this.activatedRoute.paramMap.pipe(map(() => window.history.state)).subscribe((data) => {
            if (data.param) {
                this.registro = data.param,
                this.listTipoDoccbo = data.listTipoDoccbo
                this.listTipoContcbo = data.listTipoContcbo
            }  else {
            this.loading = false;
            this.router.navigate(['masters/workers']);
          }
        })
        this.user = this.loginService.getTokenDecoded();
        this.createForm();
    }

    createForm() {
        this.registroForm = this.fb.group({
            // ruc: new FormControl(this.registro.ruc + '', [
            //     Validators.required,
            //     Validators.min(10)
            // ]),
            // nombre: new FormControl(
            //     this.registro.nombre + '',
            //     Validators.required
            // ),
            // correo: new FormControl(
            //     this.registro.correo + '',
            //     Validators.required
            // ),
            // telefono: new FormControl(this.registro.telefono + '', [
            //     Validators.required,
            //     Validators.min(8)
            // ]),
            // direccion: new FormControl(
            //     this.registro.direccion + '',
            //     Validators.required
            // ),
            // estado: new FormControl(this.registro.estado)
        });
        this.loading = false;
    }

    getTitle() {
        return this.registro.idPersona == null || this.registro.idPersona == 0
            ? 'Nuevo Proveedor'
            : 'Editar Proveedor: ' +
                  this.registro.apellidos + ' ' +
                  this.registro.nombres;
    }

    getIP = async () => {
        return await fetch('https://api.ipify.org?format=json').then(
            (response) => response.json()
        );
    };

    guardarRegistro() {
        // let registroDatos: ProveedorModel = new ProveedorModel();
        // registroDatos.clean();
        // registroDatos = this.registroForm.getRawValue();
        // registroDatos.idProveedor = this.registro.idProveedor;
        // registroDatos.estadon = this.registroForm.value.estado ? 1 : 0;
        // registroDatos.accion = this.registro.idProveedor > 0 ? 2 : 1;
        // (registroDatos.login = this.user.usuarioNombre),
        //     this.getIP().then((response) => {
        //         registroDatos.host = response.ip;
        //     });
        // this.proveedoresService
        //     .crea_edita_Proveedores$({
        //         registroDatos
        //     })
        //     .subscribe((result) => {
        //         let message = result[0];
        //         this._snackBar.openFromComponent(SnackbarComponent, {
        //             duration: 3 * 1000,
        //             data: message['']
        //         });
        //     });
    }

    fileChangeEvent(event: any) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageBase64 = reader.result.toString();
          this.file = 
          this.ref.detectChanges();
        };
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
