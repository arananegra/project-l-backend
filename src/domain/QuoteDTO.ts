import {ObjectID} from "mongodb";

export class QuoteDTO {
    public _id: ObjectID;
    public message: string;

    constructor() {
        this._id = null;
        this.message = null;
    }
}