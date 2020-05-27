import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { LocalStorageService } from '../auth/local-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketOne extends Socket {

    public constructor(private localStorageService: LocalStorageService) {
        super({
            url: environment.apiUrl, options: {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Authorization: 'Bearer ' + localStorageService.getItem('authToken')
                        }
                    }
                }
            }
        });
    }
}
