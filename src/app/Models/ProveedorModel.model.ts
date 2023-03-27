export class ProveedorModel {
   idProveedor: number;
    ruc: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    estadon: number;
    estado: boolean;
    idUsuario: number;
    accion : number;
    login: string;
    host: string;
  
    clean() {
      this.idProveedor = 0;
      this.ruc = '';
      this.nombre = '';
      this.correo = '';
      this.telefono = '';
      this.direccion = '';
      this.estado = true;
      this.estadon = 0;
      this.idUsuario = 0;
      this.accion = 0
    }
  }