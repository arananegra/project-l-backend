import {ObjectType, Field} from "type-graphql";

@ObjectType()
export class QuoteDTO {

    @Field()
    public _id: string;

    @Field({nullable: true})
    public message: string;

    constructor() {
        this._id = null;
        this.message = null;
    }
}