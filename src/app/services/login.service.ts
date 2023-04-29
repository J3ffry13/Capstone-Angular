import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    myAppUrl: string;
    myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endpoint;
        this.myApiUrl = '/api/';
    }

    login(usuario: any): Observable<any> {
        return this.http.post(this.myAppUrl + this.myApiUrl + 'login', usuario);
    }

    getPermissions(usuario: any): Observable<any> {
      return this.http.post(this.myAppUrl + this.myApiUrl + 'obtenerPermisos', usuario);
    }

    getTokenDecoded(): any {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(localStorage.getItem('token'));
        return decodedToken;
    }

    setLocalStorage(data): void {
        localStorage.setItem('token', data);
    }

    removeLocalStorge(): void {
        localStorage.removeItem('token');
    }

    getToken(): string {
        let myRawToken = localStorage.getItem('token');
        const helper = new JwtHelperService();
        const isExpired = helper.isTokenExpired(myRawToken);
        return isExpired ? null : localStorage.getItem('token');
    }
}
