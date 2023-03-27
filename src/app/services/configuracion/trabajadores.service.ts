import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrabajadoresService {
  private headers: HttpHeaders;
    myAppUrl: string;
    myApiUrl: string;
  
    constructor(private http: HttpClient) {
      this.myAppUrl = environment.endpoint;
      this.myApiUrl = '/api/configuracion';
    }

  public listarRegistros$ = (datos: any): Observable<any> =>
    this.http.post(this.myAppUrl + this.myApiUrl + '/listarPersonasTrabajadores', datos);
  public crea_edita_Trabajadores$ = (datos: any): Observable<any> =>
    this.http.post(this.myAppUrl + this.myApiUrl + '/crea_edita_PersonasTrabajadores', datos);
  public elimina_Trabajadores$ = (datos: any): Observable<any> =>
    this.http.put(this.myAppUrl + this.myApiUrl + '/elimina_PersonasTrabajadores', datos);
}
