import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';

import { SocketService } from '../services/chat-sockets/socket.service';
import { RoomsService } from '../services/rooms/rooms.service';
import { tap } from 'rxjs/operators';
import { UsersService } from '../services/users/users.service';
import { Room } from '../entities/room';
import { User } from '../entities/user';

@Injectable()
export class ChatService implements Resolve<any> {
    chats: Room[];
    user: User;
    onChatSelected: BehaviorSubject<any>;
    onContactSelected: BehaviorSubject<any>;
    onChatsUpdated: Subject<any>;
    onUserUpdated: Subject<any>;
    onLeftSidenavViewChanged: Subject<any>;
    onRightSidenavViewChanged: Subject<any>;

    constructor(private _httpClient: HttpClient,
                private roomsService: RoomsService,
                private socketService: SocketService,
                private usersService: UsersService) {
        // Set the defaults
        this.onChatSelected = new BehaviorSubject(null);
        this.onContactSelected = new BehaviorSubject(null);
        this.onChatsUpdated = new Subject();
        this.onUserUpdated = new Subject();
        this.onLeftSidenavViewChanged = new Subject();
        this.onRightSidenavViewChanged = new Subject();
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return forkJoin([
            this.roomsService.getRooms(),
            this.usersService.getProfile()
        ]).pipe(tap(([ chats, user ]) => {
            this.chats = chats;
            this.user = user;
        }));
    }

    getChat(chatId: string): Observable<Room> {
        return this.roomsService.getRoom(chatId).pipe(tap(chat => {
            this.onChatSelected.next(chat);
        }));
    }

    /**
     * Create new chat
     */
    createNewChat(title: string) {
        this.socketService.addRoom(title);
    }
}
