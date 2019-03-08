import {Field, InputType, ObjectType} from "type-graphql";
import {BlogDTO} from "./BlogDTO";

@ObjectType("UserType")
@InputType("UserInput")
export class UserDTO {
    @Field()
    public _id: string;

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

    @Field(type => [BlogDTO], {nullable: true})
    public blogsOfUser: BlogDTO[];

    constructor() {
        this._id = null;
        this.username = null;
        this.email = undefined;
        this.password = undefined;
        this.lastQuoteRequiredDate = null;
        this.alreadyUsedQuotes = null;
        this.blogsOfUser = null;
    }
}