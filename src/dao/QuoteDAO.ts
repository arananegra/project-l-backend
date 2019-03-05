import {compare, hash} from "bcryptjs"
import {Collection, Db, ObjectID, Session} from "mongodb";
import {UserDTO} from "../domain/UserDTO";
import {QuoteDTO} from "../domain/QuoteDTO";
import {DatabaseConstants} from "../constants/DatabaseConstants";

export class QuoteDAO {

    public async getQuoteNonInUseByUser(collectionReference: Collection, userToCheckUsedQuotes: UserDTO): Promise<QuoteDTO> {
        try {
            let nonUsedQuoteByUser = null;
            let quotesIdsAlreadyUsed = [];

            userToCheckUsedQuotes.alreadyUsedQuotes.map((singleQuoteObjectId: ObjectID) => {
                quotesIdsAlreadyUsed.push({[DatabaseConstants.ID_FIELD_NAME]: singleQuoteObjectId})
            });
            let quotesCursor = await collectionReference.findOne({
                $not: quotesIdsAlreadyUsed
            });

            let arrayOfFoundedQuotes = await quotesCursor.toArray();
            if (arrayOfFoundedQuotes !== undefined && arrayOfFoundedQuotes.length > 0) {
                nonUsedQuoteByUser = arrayOfFoundedQuotes[0];
            }
            return nonUsedQuoteByUser;

        } catch (Exception) {
            throw Exception;
        }
    }

    public async getRandomQuote(collectionReference: Collection): Promise<QuoteDTO> {
        try {
            let quoteRandomDocumentCursos = await collectionReference.aggregate([{$sample: {size: 1}}]);
            let quoteDTO = new QuoteDTO();
            quoteDTO = await quoteRandomDocumentCursos.toArray();
            return quoteDTO[0];
        } catch (Exception) {
            throw Exception;
        }
    }
}
