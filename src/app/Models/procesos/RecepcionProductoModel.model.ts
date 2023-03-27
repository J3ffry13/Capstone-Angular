export class RecepcionProductoModel {
    idCliente: number;
    codigo: string
    dni: string;
    nombre: string;
    apellido: string;
    fnacimiento: string;
    telefono: string;
    direccion: string;
    estado: boolean;
    estadon: number;
    accion: number;
    login: string;
    host: string;
  
    clean() {
      this.idCliente = 0;
      this.dni = '';
      this.codigo = '';
      this.nombre = '';
      this.apellido = '';
      this.fnacimiento = '';
      this.telefono = '';
      this.direccion = '';
      this.estado = true;
      this.estadon = 1;
    }
  }