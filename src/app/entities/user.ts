export class User {

    /**
     * Password
     */
    public password: string;

    /**
     * Username
     */
    public username: string;

    /**
     * Id
     */
    public _id: string;

    public avatar: string;


    public constructor(username: string = null, password: string = null, _id?: string) {
        this.username = username;
        this.password = password;
        this._id = _id;
    }
}
