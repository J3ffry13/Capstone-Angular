export class UsuarioModel {
    idUsuario: number;
    usuarioNombre: string;
    nombre?: string;
    password?: string
    user?: string

    login: string;
    host: string;

    clear() {
        this.user = ''
        this.password = ''
    }
  }