import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private headers: HttpHeaders;
    myAppUrl: string;
    myApiUrl: string;
  
    constructor(private http: HttpClient) {
      this.myAppUrl = environment.endpoint;
      this.myApiUrl = '/api/dashboard';
    }

  public listarRegistros$ = (datos: any): Observable<any> =>
    this.http.post(this.myAppUrl + this.myApiUrl + '/listadoProductos', datos);
  public crea_edita_Productos$ = (datos: any): Observable<any> =>
    this.http.post(this.myAppUrl + this.myApiUrl + '/crea_edita_Productos', datos);
  public elimina_Productos$ = (datos: any): Observable<any> =>
    this.http.put(this.myAppUrl + this.myApiUrl + '/elimina_Productos', datos);
}
