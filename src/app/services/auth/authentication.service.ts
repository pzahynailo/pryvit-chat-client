import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../../entities/user';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {

    private readonly api = `${environment.apiUrl}/api/`;

    public constructor(private http: HttpClient,
                       private storage: LocalStorageService,
                       private router: Router) {
    }

    public login(user: User): Observable<AccessToken> {
        let params: HttpParams = new HttpParams();
        params = params.append('username', user.username);
        params = params.append('password', user.password);

        return this.http.post<AccessToken>(this.api + 'auth/login', params)
            .pipe(
                catchError(() => {
                    this.storage.removeToken();
                    return EMPTY;
                }),
                tap((response: AccessToken) => {
                    this.storage.setToken(response.value);
                    this.router.navigateByUrl('/');
                })
            )
    }

    public isLoggedIn(): boolean {
        return !!this.storage.getToken();
    }

    public logout(): void {
        this.storage.removeToken();
        this.router.navigate([ '/auth' ]);
    }

}

export interface AccessToken {
    expireTime: string;
    value: string;
}

export interface JwtVerifyAnswer {
    exp: number;
    iat: number;
    username: string;
}
