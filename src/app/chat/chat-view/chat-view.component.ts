import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ChatService } from '../chat.service';
import { Room } from '../../entities/room';
import { User } from '../../entities/user';
import { Message } from '../../entities/message';
import { SocketService } from '../../services/chat-sockets/socket.service';

@Component({
    selector: 'chat-view',
    templateUrl: './chat-view.component.html',
    styleUrls: [ './chat-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ChatViewComponent implements OnInit, OnDestroy, AfterViewInit {
    user: User;
    replyInput: any;
    selectedChat: Room;

    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

    @ViewChildren('replyInput')
    replyInputField;

    @ViewChild('replyForm')
    replyForm: NgForm;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _chatService: ChatService,
        private socketService: SocketService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.user = this._chatService.user;
        this.getMessagesFromSocket();
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
                if (chatData) {
                    this.selectedChat = chatData;
                    this.socketService.joinRoom(chatData._id);
                    // this.contact = chatData.contact;
                    // this.selectedChat.messages = chatData.dialog;
                    this.readyToReply();
                }
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        this.replyInput = this.replyInputField.first.nativeElement;
        this.readyToReply();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Decide whether to show or not the contact's avatar in the message row
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    shouldShowContactAvatar(message: Message, i): boolean {
        const messages = this.selectedChat.messages;
        return (
            message.user._id !== this.user._id &&
            ((messages[i + 1] && messages[i + 1].user._id !== message.user._id) || !messages[i + 1])
        );
    }

    /**
     * Check if the given message is the first message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isFirstMessageOfGroup(message: Message, i): boolean {
        return (i === 0 || this.selectedChat.messages[i - 1]
            && this.selectedChat.messages[i - 1].user._id !== message.user._id);
    }

    /**
     * Check if the given message is the last message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isLastMessageOfGroup(message: Message, i): boolean {
        return (i === this.selectedChat.messages.length - 1 || this.selectedChat.messages[i + 1]
            && this.selectedChat.messages[i + 1].user._id !== message.user._id);
    }

    /**
     * Ready to reply
     */
    readyToReply() {
        setTimeout(() => {
            this.focusReplyInput();
            this.scrollToBottom();
        });
    }

    /**
     * Focus to the reply input
     */
    focusReplyInput(): void {
        setTimeout(() => {
            this.replyInput.focus();
        });
    }

    /**
     * Scroll to the bottom
     *
     * @param {number} speed
     */
    scrollToBottom(speed?: number): void {
        speed = speed || 400;
        if (this.directiveScroll) {
            this.directiveScroll.update();

            setTimeout(() => {
                this.directiveScroll.scrollToBottom(0, speed);
            });
        }
    }

    /**
     * Reply
     */
    reply(event): void {
        event.preventDefault();
        if (!this.replyForm.form.value.message) {
            return;
        }
        const message: Message = new Message(
            this.user,
            this.replyForm.form.value.message,
            this.selectedChat._id,
            new Date());
        this.socketService.sendMessage(
            this.replyForm.form.value.message,
            this.user,
            this.selectedChat._id
        );
        // Add the message to the chat
        this.selectedChat.messages.push(message);
        // Reset the reply form
        this.replyForm.reset();
        this.readyToReply();
    }

    getMessagesFromSocket() {
        this.socketService.getMessage()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(message => {
                console.log(message);
                if (message.room === this.selectedChat._id && this.user._id !== message.user._id) {
                    this.selectedChat.messages.push(message);
                }
            })
    }
}
