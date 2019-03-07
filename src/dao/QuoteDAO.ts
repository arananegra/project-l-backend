import {compare, hash} from "bcryptjs"
import {Collection, Db, ObjectID, Session} from "mongodb";
import {UserDTO} from "../domain/UserDTO";
import {QuoteDTO} from "../domain/QuoteDTO";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import {ExceptionDTO} from "../domain/ExceptionDTO";
import {ExceptionConstants} from "../constants/ExceptionConstants";

export class QuoteDAO {

    public async getQuoteNotInUseByUser(collectionReference: Collection, userToCheckUsedQuotes: UserDTO): Promise<QuoteDTO> {
        try {
            let nonUsedQuoteByUser = null;
            let quotesIdsAlreadyUsed = [];

            userToCheckUsedQuotes.alreadyUsedQuotes.map((singleQuoteObjectId: string) => {
                if (ObjectID.isValid(singleQuoteObjectId)) {
                    quotesIdsAlreadyUsed.push(new ObjectID(singleQuoteObjectId))
                } else {
                    throw new ExceptionDTO(ExceptionConstants.MONGO_ID_INVALID_ID, ExceptionConstants.MONGO_ID_INVALID_MESSAGE);
                }
            });

            let singleQuoteNotUsedFound = await collectionReference.findOne({
                [DatabaseConstants.ID_FIELD_NAME]: {$nin: quotesIdsAlreadyUsed}
            });

            if (singleQuoteNotUsedFound !== undefined && singleQuoteNotUsedFound !== null) {
                nonUsedQuoteByUser = singleQuoteNotUsedFound;
            }
            return nonUsedQuoteByUser;

        } catch (Exception) {
            console.trace(Exception);
            throw Exception;
        }
    }
}
