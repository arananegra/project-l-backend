import {InputType} from "type-graphql";
import {Field} from "type-graphql";

@InputType()
export class UserSearcher {
    @Field({nullable: true})
    public usernameCriteria: string;

    @Field({nullable: true})
    public emailCriteria: string;

    @Field({nullable: true})
    public idCriteria: string;

    public constructor() {
        this.usernameCriteria = null;
        this.emailCriteria = null;
        this.idCriteria = null;
    }
}