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
import {CurrentUser} from '@/Models/auth/auth.model';
import {NgxPermissionsService} from 'ngx-permissions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    // @HostBinding('class') class = 'login-box';
    public loginForm: UntypedFormGroup;
    public isAuthLoading = false;
    private user: CurrentUser;

    constructor(
        private toastr: ToastrService,
        private router: Router,
        private loginService: LoginService,
        private permissionsService: NgxPermissionsService
    ) {}

    ngOnInit() {
        this.loginForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, Validators.required),
            password: new UntypedFormControl(null, Validators.required)
        });
    }

    loginByAuth() {
        this.isAuthLoading = true;
        var usuario = {
            user: '',
            password: ''
        };
        usuario.user = this.loginForm.value.email;
        usuario.password = this.loginForm.value.password;
        this.loginService.login(usuario).subscribe(
            (data) => {
                if (data['token']) {
                    localStorage.setItem('token', data['token']);
                    this.user = this.loginService.getTokenDecoded();
                    this.loginService
                        .getPermissions({user: this.user.idUsuario})
                        .subscribe(
                            (result) => {
                                let data = [];
                                result.forEach((x) => {
                                    data.push(x.accesoName);
                                });
                                this.permissionsService.loadPermissions(data);
                                this.router.navigate(['/']);
                                this.isAuthLoading = false;
                            },
                            (error) => {
                                console.log(error);
                                this.isAuthLoading = false;
                                this.toastr.error(error.error.message, 'Error');
                                this.loginForm.reset();
                            }
                        );
                } else {
                    this.toastr.error('Error', 'Error xd');
                }
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
