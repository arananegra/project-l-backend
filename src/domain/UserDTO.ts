import {ObjectID} from "mongodb";

export class UserDTO {
    private _id: ObjectID;
    private _name: string;
    private _last_quote_required_date: number;
    private _already_used_quotes: Array<number>;

    constructor() {
        this._id = null;
        this._name = null;
        this._last_quote_required_date = null;
        this._already_used_quotes = null;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get last_quote_required_date(): number {
        return this._last_quote_required_date;
    }

    set last_quote_required_date(value: number) {
        this._last_quote_required_date = value;
    }

    get already_used_quotes(): Array<number> {
        return this._already_used_quotes;
    }

    set already_used_quotes(value: Array<number>) {
        this._already_used_quotes = value;
    }
}