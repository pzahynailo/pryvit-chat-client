import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { LocalStorageService } from '../auth/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class SocketOne extends Socket {

    public constructor(private localStorageService: LocalStorageService) {
        super({
            url: '', options: {
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
