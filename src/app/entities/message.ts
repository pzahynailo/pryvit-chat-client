import { User } from './user';

export class Message {

    /**
     * Username
     */
    public user: User;

    /**
     * Message text
     */
    public text: string;

    public room: string;

    public date: Date;

    public constructor(user: User, text: string, date: Date, room?: string) {
        this.user = user;
        this.text = text;
        this.room = room;
        this.date = date;
    }
}
