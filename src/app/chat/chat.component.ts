import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { ChatService } from './chat.service';
import { FuseConfigService } from '../../@fuse/services/config.service';


@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: [ './chat.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ChatComponent implements OnInit, OnDestroy {
    selectedChat: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(private _chatService: ChatService,
                private _fuseConfigService: FuseConfigService) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._fuseConfigService.config = {
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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
                this.selectedChat = chatData;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
