import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {LoginService} from '@services/login.service';
import {Router} from '@angular/router';
import { CurrentUser } from '@/Models/auth/auth.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    // @HostBinding('class') class = 'login-box';
    public loginForm: UntypedFormGroup;
    public isAuthLoading = false;

    constructor(
        private toastr: ToastrService,
        private router: Router,
        private loginService: LoginService
    ) {}

    ngOnInit() {
        this.loginForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, Validators.required),
            password: new UntypedFormControl(null, Validators.required)
        });
    }

    loginByAuth() {
        this.isAuthLoading = true;
        var usuario =  {
            user : '',
            password : ''
        }
        usuario.user = this.loginForm.value.email;
        usuario.password = this.loginForm.value.password;
        this.loginService.login(usuario).subscribe(
            (data) => {
                if (data['token']) {
                    localStorage.setItem('token', data['token']);
                }
                this.isAuthLoading = false;
                this.router.navigate(['/dashboard']);
                let user: CurrentUser = this.loginService.getTokenDecoded()
            },
            (error) => {
                console.log(error);
                this.isAuthLoading = false;
                this.toastr.error(error.error.message, 'Error');
                this.loginForm.reset();
            }
        );
    }

    ngOnDestroy() {
        // this.renderer.removeClass(
        //     document.querySelector('app-root'),
        //     'login-page'
        // );
    }
}
