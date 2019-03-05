import {ObjectID} from "mongodb";

export class UserDTO {
    public _id: ObjectID;
    public username: string;
    public email: string;
    public password: string;
    public lastQuoteRequiredDate: number;
    public alreadyUsedQuotes: Array<number>;

    constructor() {
        this._id = null;
        this.username = null;
        this.email = null;
        this.password = null;
        this.lastQuoteRequiredDate = null;
        this.alreadyUsedQuotes = null;
    }
}