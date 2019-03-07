import {Arg, Mutation, Authorized, FieldResolver, Query, Resolver, ResolverInterface, Root, Ctx} from "type-graphql";
import {UserDTO} from "../../domain/UserDTO";
import {UserSearcher} from "../../domain/searchers/UserSearcher";
import {UserBS} from "../../bs/UserBS";
import * as jsonwebtoken from "jsonwebtoken";
import {ServiceConstants} from "../../constants/ServiceConstants";
import {ExpressContext} from "../../../index";

@Resolver(of => UserDTO)
export class UserResolver {

    @Authorized()
    @Query(returns => [UserDTO], {nullable: true})
    async searchUser(@Arg("userSearcher", {nullable: true}) userSearcher: UserSearcher) {
        let userBS = new UserBS();
        let foundedUsers = await userBS.searchUser(userSearcher);
        return foundedUsers;
    }

    @Query(returns => UserDTO, {nullable: true})
    async login(@Arg("userToLogin", {nullable: true}) userToLogin: UserDTO, @Ctx() ctx: ExpressContext) {
        let userBS = new UserBS();
        let resultOfLoginUser: UserDTO = await userBS.loginUser(userToLogin);
        if (resultOfLoginUser !== null) {
            let token = jsonwebtoken.sign({"email": userToLogin.email}, ServiceConstants.TOKEN_SECRET, {
                    expiresIn: '1h'
                }
            );
            ctx.res.header(ServiceConstants.BEARER_NAME_CONSTANT, token);
        }

        return resultOfLoginUser;

    }

}