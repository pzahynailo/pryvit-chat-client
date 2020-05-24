import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseMatSidenavHelperService } from '@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.service';
import { ChatService } from '../../../chat.service';
import { Room } from '../../../../entities/room';
import { SocketService } from '../../../../services/chat-sockets/socket.service';
import { User } from '../../../../entities/user';
import { AuthenticationService } from '../../../../services/auth/authentication.service';

@Component({
    selector: 'chat-chats-sidenav',
    templateUrl: './chats.component.html',
    styleUrls: [ './chats.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ChatChatsSidenavComponent implements OnInit, OnDestroy {
    chats: Room[];
    chatSearch: any;
    contacts: any[];
    searchText: string;
    user: User;

    // Private
    private unsubscribeAll$: Subject<any>;

    constructor(
        private chatService: ChatService,
        private fuseMatSidenavHelperService: FuseMatSidenavHelperService,
        public mediaObserver: MediaObserver,
        private socketService: SocketService,
        private authService: AuthenticationService
    ) {
        // Set the defaults
        this.chatSearch = {
            name: ''
        };
        this.searchText = '';

        // Set the private defaults
        this.unsubscribeAll$ = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.user = this.chatService.user;
        this.chats = this.chatService.chats;
        this.contacts = this.chatService.contacts;
        this.getRoomsFromSocket();

        this.chatService.onChatsUpdated
            .pipe(takeUntil(this.unsubscribeAll$))
            .subscribe(updatedChats => {
                this.chats = updatedChats;
            });

        this.chatService.onUserUpdated
            .pipe(takeUntil(this.unsubscribeAll$))
            .subscribe(updatedUser => {
                this.user = updatedUser;
            });
    }

    getRoomsFromSocket() {
        this.socketService.getRooms().pipe(takeUntil(this.unsubscribeAll$))
            .subscribe(room => {
                this.chats = [
                    room,
                    ...this.chats
                ]
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll$.next();
        this.unsubscribeAll$.complete();
    }

    getChat(chat: Room): void {
        this.chatService.getChat(chat._id).subscribe();

        if (!this.mediaObserver.isActive('gt-md')) {
            this.fuseMatSidenavHelperService.getSidenav('chat-left-sidenav').toggle();
        }
    }

    /**
     * Set user status
     *
     * @param status
     */
    setUserStatus(status): void {
        this.chatService.setUserStatus(status);
    }

    /**
     * Change left sidenav view
     *
     * @param view
     */
    changeLeftSidenavView(view): void {
        this.chatService.onLeftSidenavViewChanged.next(view);
    }

    createNewRoom() {
        this.chatService.createNewChat(this.searchText);
        this.chatSearch.name = '';
        this.searchText = '';
    }

    /**
     * Logout
     */
    logout(): void {
        this.authService.logout();
    }
}
