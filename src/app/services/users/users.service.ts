import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../entities/user';
import { environment } from '../../../environments/environment';


const api = `${environment.apiUrl}/api/users`;

@Injectable({
    providedIn: 'root',
})
export class UsersService {

    public constructor(private http: HttpClient) {
    }

    public createUser(user: User): Observable<User> {
        let body: HttpParams = new HttpParams();
        body = body.append('username', user.username);
        body = body.append('password', user.password);
        return this.http.post<User>(`${api}/create`, body);
    }

    public getProfile(): Observable<User> {
        return this.http.get<User>(`${api}/get-profile`);
    }
}
