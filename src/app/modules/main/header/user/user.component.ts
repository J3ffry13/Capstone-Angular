import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import {DateTime} from 'luxon';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public user;

    constructor(private loginService: LoginService,
        private router: Router) {}

    ngOnInit(): void {
        this.user = this.loginService.getTokenDecoded();
    }

    logout() {
        this.loginService.removeLocalStorge();
        this.router.navigate(['/login']);
    }

    formatDate(date) {
        return DateTime.fromISO(date).toFormat('dd LLL yyyy');
    }
}
