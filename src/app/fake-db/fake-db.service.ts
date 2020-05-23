import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ChatFakeDb } from 'app/fake-db/chat';
import { ChatPanelFakeDb } from 'app/fake-db/chat-panel';

export class FakeDbService implements InMemoryDbService {
    createDb(): any {
        return {
            // Chat
            'chat-contacts': ChatFakeDb.contacts,
            'chat-chats': ChatFakeDb.chats,
            'chat-user': ChatFakeDb.user,

            // Chat Panel
            'chat-panel-contacts': ChatPanelFakeDb.contacts,
            'chat-panel-chats': ChatPanelFakeDb.chats,
            'chat-panel-user': ChatPanelFakeDb.user,
        };
    }
}
