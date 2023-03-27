export class ProductoModel {
    idProducto: number;
    idProveedor: number;
    nombreProveedor: string;
    codigoProducto: string;
    descripcionProducto: string;
    stock: number;
    dc_precio: number;
    accion: number;
    login: string;
    host: string;

    clean() {
        this.idProducto = 0;
        this.idProveedor = 0;
        this.nombreProveedor = '';
        this.codigoProducto = '';
        this.descripcionProducto = '';
        this.stock = 0;
        this.dc_precio = 0;
        this.accion = 0;
    }
}
