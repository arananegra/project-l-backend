import {UserInputError} from 'apollo-server';

export class ExceptionDTO extends UserInputError {
    public code: number;
    public message: string;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
        this.message = message;
    }
}