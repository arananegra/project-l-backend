import {Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, ResolverInterface, Root} from "type-graphql";
import {UserDTO} from "../../domain/UserDTO";
import {ExceptionDTO} from "../../domain/ExceptionDTO";
import {ExceptionConstants} from "../../constants/ExceptionConstants";
import {ObjectID} from "mongodb";
import {QuoteDTO} from "../../domain/QuoteDTO";
import {QuoteBS} from "../../bs/QuoteBS";

@Resolver(of => QuoteDTO)
export class QuoteResolver {

    @Mutation(returns => QuoteDTO, {nullable: true})
    async getNewQuoteForUser(@Arg("userRequesting", {nullable: true}) userRequesting: UserDTO) {
        let quoteBS = new QuoteBS();
        let notUsedQuote = null;
        if (userRequesting._id === undefined) {
            throw new ExceptionDTO(ExceptionConstants.MISSING_ID_FIELD_ID, ExceptionConstants.MISSING_ID_FIELD_MESSAGE);
        } else {
            notUsedQuote = await quoteBS.getQuoteNotInUseByUser(userRequesting);
            if (notUsedQuote === null) {
                throw new ExceptionDTO(ExceptionConstants.NO_AVAILABLE_QUOTES_FOUND_FOR_USER__ID,
                    ExceptionConstants.NO_AVAILABLE_QUOTES_FOUND_FOR_USER_MESSAGE)
            }
        }
        return notUsedQuote;
    }
}