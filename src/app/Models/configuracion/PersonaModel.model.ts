export class PersonaModel {
    idPersona: number;
    tipoDocu: number;
    dni: string;
    nombres: string;
    apellidos: string;
    f_nacimiento: string;
    urlImagen: string;
    accion: number;
    login: string;
    host: string;

    clean() {
        this.idPersona = 0;
        this.tipoDocu = 0;
        this.dni = '';
        this.nombres = '';
        this.apellidos = '';
        this.f_nacimiento = '';
        this.urlImagen = '';
        this.accion = 0;
    }
}
