import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../../../chat.service';

@Component({
    selector: 'chat-contact-sidenav',
    templateUrl: './contact.component.html',
    styleUrls: [ './contact.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ChatContactSidenavComponent implements OnInit, OnDestroy {
    contact: any;

    private _unsubscribeAll: Subject<any>;

    constructor(private _chatService: ChatService) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._chatService.onContactSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contact => {
                this.contact = contact;
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
