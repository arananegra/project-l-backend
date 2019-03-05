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

            userToCheckUsedQuotes.alreadyUsedQuotes.map((singleQuoteObjectId: number) => {
                quotesIdsAlreadyUsed.push(new ObjectID(singleQuoteObjectId))
            });

            let singleQuoteNotUsedFound = await collectionReference.findOne({
                [DatabaseConstants.ID_FIELD_NAME]: {$nin: quotesIdsAlreadyUsed}
            });

            if (singleQuoteNotUsedFound !== undefined && singleQuoteNotUsedFound !== null) {
                nonUsedQuoteByUser = singleQuoteNotUsedFound;
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
