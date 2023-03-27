import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private headers: HttpHeaders;
    myAppUrl: string;
    myApiUrl: string;
  
    constructor(private http: HttpClient) {
      this.myAppUrl = environment.endpoint;
      this.myApiUrl = '/api/dashboard';
    }

  public listarRegistros$ = (datos: any): Observable<any> =>
    this.http.post(this.myAppUrl + this.myApiUrl + '/listadoClientes', datos);
  public crea_edita_Clientes$ = (datos: any): Observable<any> =>
    this.http.post(this.myAppUrl + this.myApiUrl + '/crea_edita_Clientes', datos);
  public elimina_Clientes$ = (datos: any): Observable<any> =>
    this.http.put(this.myAppUrl + this.myApiUrl + '/elimina_Clientes', datos);
}
