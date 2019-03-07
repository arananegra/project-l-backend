import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class UserDTO {
    @Field()
    public _id: string;

    @Field({nullable: true})

    @Field({nullable: true})
    public username: string;

    @Field({nullable: true})
    public email: string;

    @Field({nullable: true})
    public password: string;

    @Field({nullable: true})
    public lastQuoteRequiredDate: number;

    @Field(type => [String], {nullable: true})
    public alreadyUsedQuotes: Array<string>;

    constructor() {
        this._id = null;
        this.username = null;
        this.email = null;
        this.password = null;
        this.lastQuoteRequiredDate = null;
        this.alreadyUsedQuotes = null;
    }
}