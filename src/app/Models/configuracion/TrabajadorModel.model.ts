export class TrabajadorModel {
    idTrabajador: number;
    idPersona: number;
    tipoID: number;
    f_inicio: string;
    f_fin: string;
    urlDocumento: string;
    accion: number;
    estado: number;
    status: boolean;
    login: string;
    host: string;

    clean() {
        this.idTrabajador = 0;
        this.idPersona = 0;
        this.tipoID = 0;
        this.f_inicio = '';
        this.f_fin = '';
        this.urlDocumento = '';
        this.estado = 0;
        this.status = false;
        this.accion = 0;
    }
}
