import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../../entities/room';
import { environment } from '../../../environments/environment';

const api = `${environment.apiUrl}/api/`;

@Injectable({
    providedIn: 'root',
})
export class RoomsService {

    public constructor(private http: HttpClient) {
    }

    /**
     * Get rooms
     */
    public getRooms(): Observable<Room[]> {
        return this.http.get<Room[]>(`${api}rooms`);
    }

    /**
     * Get room by id.
     * @param id
     */
    public getRoom(id: string): Observable<Room> {
        return this.http.get<Room>(`${api}rooms/room/${id}`);
    }
}
