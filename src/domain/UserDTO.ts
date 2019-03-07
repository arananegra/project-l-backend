import {Field, InputType, ObjectType} from "type-graphql";

@ObjectType("UserType")
@InputType("UserInput")
export class UserDTO {
    @Field()
    public _id: string;

    @Field({nullable: true})

    @Field({nullable: true})
    public username: string;

    @Field({nullable: false})
    public email: string;

    @Field({nullable: false})
    public password: string;

    @Field({nullable: true})
    public lastQuoteRequiredDate: number;

    @Field(type => [String], {nullable: true})
    public alreadyUsedQuotes: Array<string>;

    constructor() {
        this._id = null;
        this.username = null;
        this.email = undefined;
        this.password = undefined;
        this.lastQuoteRequiredDate = null;
        this.alreadyUsedQuotes = null;
    }
}