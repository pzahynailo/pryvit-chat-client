import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { SocketService } from '../services/chat-sockets/socket.service';
import { RoomsService } from '../services/rooms/rooms.service';
import { tap } from 'rxjs/operators';
import { UsersService } from '../services/users/users.service';
import { Room } from '../entities/room';
import { User } from '../entities/user';

@Injectable()
export class ChatService implements Resolve<any> {
    contacts: any[];
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

    /**
     * Get chat
     */
    getChat(chatId: string): Observable<Room> {
        return this.roomsService.getRoom(chatId).pipe(tap(chat => {
            this.onChatSelected.next(chat);
        }));
        // const chatItem = this.user.chatList.find((item) => {
        //     return item.contactId === contactId;
        // });

        // // Create new chat, if it's not created yet.
        // if (!chatItem) {
        //     this.createNewChat(contactId).then((newChats) => {
        //         this.getChat(contactId);
        //     });
        //     return;
        // }

        // return new Promise((resolve, reject) => {
        //     this._httpClient.get('api/chat-chats/' + chatItem.id)
        //         .subscribe((response: any) => {
        //             const chat = response;
        //
        //             const chatContact = this.contacts.find((contact) => {
        //                 return contact.id === contactId;
        //             });
        //
        //             const chatData = {
        //                 chatId: chat.id,
        //                 dialog: chat.dialog,
        //                 contact: chatContact
        //             };
        //
        //             this.onChatSelected.next({...chatData});
        //
        //         }, reject);
        //
        // });

    }

    /**
     * Create new chat
     */
    createNewChat(title: string) {
        // new Promise((resolve, reject) => {
        //
        //     const contact = this.contacts.find((item) => {
        //         return item.id === contactId;
        //     });
        //
        //     const chatId = FuseUtils.generateGUID();
        //
        //     const chat = {
        //         id: chatId,
        //         dialog: []
        //     };
        //
        //     const chatListItem = {
        //         contactId: contactId,
        //         id: chatId,
        //         lastMessageTime: '2017-02-18T10:30:18.931Z',
        //         name: contact.name,
        //         unread: null
        //     };
        //
        //     // Add new chat list item to the user's chat list
        //     // this.user.chatList.push(chatListItem);
        //
        //     // Post the created chat
        //     this._httpClient.post('api/chat-chats', {...chat})
        //         .subscribe((response: any) => {
        //
        //             // Post the new the user data
        //             // this._httpClient.post('api/chat-user/' + this.user.id, this.user)
        //             //     .subscribe(newUserData => {
        //             //
        //             //         // Update the user data from server
        //             //         this.getUser().then(updatedUser => {
        //             //             this.onUserUpdated.next(updatedUser);
        //             //             resolve(updatedUser);
        //             //         });
        //             //     });
        //         }, reject);
        // });
        this.socketService.addRoom(title);
    }

    /**
     * Select contact
     *
     * @param contact
     */
    selectContact(contact): void {
        this.onContactSelected.next(contact);
    }

    /**
     * Set user status
     *
     * @param status
     */
    setUserStatus(status): void {
        // this.user.status = status;
    }

    /**
     * Update user data
     *
     * @param userData
     */
    updateUserData(userData): void {
        // this._httpClient.post('api/chat-user/' + this.user.id, userData)
        //     .subscribe((response: any) => {
        //             this.user = userData;
        //         }
        //     );
    }

    /**
     * Update the chat dialog
     *
     * @param chatId
     * @param dialog
     * @returns {Promise<any>}
     */
    updateDialog(chatId, dialog): Promise<any> {
        return new Promise((resolve, reject) => {

            const newData = {
                id: chatId,
                dialog: dialog
            };

            this._httpClient.post('api/chat-chats/' + chatId, newData)
                .subscribe(updatedChat => {
                    resolve(updatedChat);
                }, reject);
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    // getContacts(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.get('api/chat-contacts')
    //             .subscribe((response: any) => {
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    /**
     * Get chats
     *
     * @returns {Promise<any>}
     */
    getChats(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/rooms')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get user
     *
     * @returns {Promise<any>}
     */
    getUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/chat-user')
                .subscribe((response: any) => {
                    resolve(response[0]);
                }, reject);
        });
    }
}
