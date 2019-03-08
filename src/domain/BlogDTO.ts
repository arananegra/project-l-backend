import {Field, InputType, ObjectType} from "type-graphql";

@ObjectType("BlogType")
@InputType("BlogInput")
export class BlogDTO {
    @Field()
    public _id: number;

    @Field({nullable: true})
    public blogName: string;

    constructor() {
        this._id = null;
        this.blogName = null;
    }
}