export class ActividadModel {
    idActividad: number;
    codigo: string;
    nombre: string;
    estado: boolean;
    login: string;
    accion: number;

    clean() {
        this.idActividad = 0;
        this.codigo = '';
        this.nombre = '';
        this.estado = true;
        this.login = '';
        this.accion = 0;
    }
}