import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../entities/user';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    error: string;

    constructor(
        private fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private userService: UsersService,
    ) {
        // Configure the layout
        this.fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: [ '', [ Validators.required, Validators.minLength(2) ] ],
            password: [ '', [ Validators.required, Validators.minLength(2) ] ]
        });
    }

    login() {
        if (!this.loginForm.valid) {
            return;
        }
        this.error = '';
        this.authService.login(this.getUser()).subscribe(
            () => console.info('Logged in successfully.'),
            () => this.error = 'Неправильний логін або пароль.'
        );
    }

    register() {
        if (!this.loginForm.valid) {
            return;
        }
        this.error = '';
        const user = this.getUser();
        this.userService.createUser(user)
            .pipe(
                catchError(() => {
                    this.error = 'Користувач с таким нікнеймом вже зареєстрований.';
                    return throwError('User already exists');
                }),
                switchMap(() => this.authService.login(user)),
            ).subscribe();
    }

    private getUser(): User {
        return new User(this.username.value, this.password.value);
    }

    get username(): AbstractControl {
        return this.loginForm.get('username');
    }

    get password(): AbstractControl {
        return this.loginForm.get('password');
    }
}
