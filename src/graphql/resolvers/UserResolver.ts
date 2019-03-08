import {Arg, Mutation, Authorized, FieldResolver, Query, Resolver, ResolverInterface, Root, Ctx} from "type-graphql";
import {UserDTO} from "../../domain/UserDTO";
import {UserSearcher} from "../../domain/searchers/UserSearcher";
import {UserBS} from "../../bs/UserBS";
import * as jsonwebtoken from "jsonwebtoken";
import {ServiceConstants} from "../../constants/ServiceConstants";
import {ExpressContext} from "../../../index";
import {ExceptionDTO} from "../../domain/ExceptionDTO";
import {ExceptionConstants} from "../../constants/ExceptionConstants";
import {BlogDTO} from "../../domain/BlogDTO";
import {ObjectID} from "mongodb";

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
            return resultOfLoginUser;
        } else {
            throw new ExceptionDTO(ExceptionConstants.WRONG_CREDENTIALS_PROVIDED_ID,
                ExceptionConstants.WRONG_CREDENTIALS_PROVIDED_MESSAGE)
        }
    }


    @Mutation(returns => UserDTO, {nullable: true})
    async register(@Arg("userToRegister", {nullable: true}) userToRegister: UserDTO, @Ctx() ctx: ExpressContext) {
        let userBS = new UserBS();
        let resultOfRegisterUser = await userBS.registerNewUser(userToRegister);
        if (resultOfRegisterUser !== null) {
            let token = jsonwebtoken.sign({"email": userToRegister.email}, ServiceConstants.TOKEN_SECRET, {
                    expiresIn: '1h'
                }
            );
            ctx.res.header(ServiceConstants.BEARER_NAME_CONSTANT, token);
            return resultOfRegisterUser;
        } else {
            throw new ExceptionDTO(ExceptionConstants.USER_ALREADY_EXISTS_ID, ExceptionConstants.USER_ALREADY_EXISTS_MESSAGE);
        }
    }

    @FieldResolver(of => UserDTO)
    async blogsOfUser(@Root() user: UserDTO, @Arg("blogSearcher", {nullable: true}) blogSearcher: BlogDTO) {
        let blogs = [];
        let blog1 = new BlogDTO();
        blog1._id = 1;
        blog1.blogName = "Prueba de blog 1";

        let blog2 = new BlogDTO();
        blog2._id = 2;
        blog2.blogName = "Prueba de blog 2";
        blogs.push(blog1);
        blogs.push(blog2);

        if (blogSearcher !== undefined) {
            let blogsOfUserById = blogs.filter(singleBlog => {
                return singleBlog._id === blogSearcher._id
            })

            blogs = blogsOfUserById;
        }
        return blogs;
    }
}