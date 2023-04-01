export class GrupoTrabajoModel {
    idGrupo: number;
    codigo: string;
    descripcion: string;
    idSupervisor: number;
    supervisorNombre: string;
    trabajadores: string;
    accion: number;
    login: string;

    clean() {
        this.idGrupo = 0;
        this.codigo = '';
        this.descripcion = '';
        this.idSupervisor = 0;
        this.supervisorNombre = '';
        this.accion = 0;
        this.trabajadores = '';
        this.login = '';
    }
}
