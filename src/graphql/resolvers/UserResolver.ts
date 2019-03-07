import {Arg, Authorized, FieldResolver, Query, Resolver, ResolverInterface, Root} from "type-graphql";
import {UserDTO} from "../../domain/UserDTO";
import {UserSearcher} from "../../domain/searchers/UserSearcher";
import {UserBS} from "../../bs/UserBS";

@Resolver(of => UserDTO)
export class UserResolver {

    @Query(returns => [UserDTO], {nullable: true})
    async searchUser(@Arg("userSearcher", {nullable: true}) userSearcher: UserSearcher) {
        let userBS = new UserBS();
        let foundedUsers = await userBS.searchUser(userSearcher);
        return foundedUsers;
    }
}