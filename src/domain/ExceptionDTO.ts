import {ApolloError, createError} from 'apollo-errors';

export class ExceptionDTO  {
    public code: number;
    public message: string;

    constructor(code: number, message: string, name: string) {
        this.code = code;
        this.message = message;
    }
}