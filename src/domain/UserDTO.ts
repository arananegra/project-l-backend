import {ObjectID} from "mongodb";

export class UserDTO {
    public _id: ObjectID;
    public username: string;
    public email: string;
    public password: string;
    public last_quote_required_date: number;
    public already_used_quotes: Array<number>;

    constructor() {
        this._id = null;
        this.username = null;
        this.email = null;
        this.password = null;
        this.last_quote_required_date = null;
        this.already_used_quotes = null;
    }
}