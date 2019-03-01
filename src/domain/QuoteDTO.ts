import {ObjectID} from "mongodb";

export class QuoteDTO {
    private _id: ObjectID;
    private _message: string;

    constructor() {
        this._id = null;
        this._message = null;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }
}