import {QuoteDTO} from "../domain/QuoteDTO";
import {DbConnectionBS} from "./DbConnectionBS";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import {Client, Db, Collection} from "mongodb";
import {QuoteDAO} from "../dao/QuoteDAO";
import {UserDTO} from "../domain/UserDTO";
import {UserBS} from "./UserBS";
import {UserSearcher} from "../domain/searchers/UserSearcher";
import {ExceptionConstants} from "../constants/ExceptionConstants";
import {ExceptionDTO} from "../domain/ExceptionDTO";

export class QuoteBS {
    private quoteDAO: QuoteDAO;
    private userBS: UserBS;

    constructor() {
        this.quoteDAO = new QuoteDAO();
        this.userBS = new UserBS();
    }

    public async getQuoteNotInUseByUser(userToCheckUsedQuotes: UserDTO): Promise<QuoteDTO> {
        const client: Client = await DbConnectionBS.getClient()
            .catch((clientException) => {
                throw clientException;
            });

        try {
            let quoteNotInUse = null;
            const db: Db = await DbConnectionBS.getDbFromClient(client);
            const quotesCollection = db.collection(DatabaseConstants.QUOTE_COLLECTION_NAME);
            let userSearcher = new UserSearcher();
            userSearcher.idCriteria = userToCheckUsedQuotes._id;
            let userToCheckWithFilledFieldsArray = await this.userBS.getUsersBySearcher(userSearcher);
            let singleUserCheckWithFilledField = userToCheckWithFilledFieldsArray[0];
            let currentTimestamp = new Date().getTime();

            if (singleUserCheckWithFilledField !== null && singleUserCheckWithFilledField !== undefined) {
                if (singleUserCheckWithFilledField.lastQuoteRequiredDate === null ||
                    currentTimestamp - singleUserCheckWithFilledField.lastQuoteRequiredDate > DatabaseConstants.TWENTY_FOUR_HOURS_IN_MILISECONDS) {

                    if (singleUserCheckWithFilledField.alreadyUsedQuotes === null) {
                        singleUserCheckWithFilledField.alreadyUsedQuotes = [];
                    }

                    quoteNotInUse = await this.quoteDAO.getQuoteNotInUseByUser(quotesCollection, singleUserCheckWithFilledField);

                    if (quoteNotInUse !== null) {
                        let userDTOtoUpdateLastQuoteTime = new UserDTO();
                        userDTOtoUpdateLastQuoteTime._id = singleUserCheckWithFilledField._id;
                        userDTOtoUpdateLastQuoteTime.lastQuoteRequiredDate = currentTimestamp;
                        userDTOtoUpdateLastQuoteTime.alreadyUsedQuotes = [...singleUserCheckWithFilledField.alreadyUsedQuotes, quoteNotInUse._id];
                        await this.userBS.updateUser(userDTOtoUpdateLastQuoteTime);
                    }

                } else {
                    throw new ExceptionDTO(ExceptionConstants.LAST_QUOTED_REQUIRED_DATE_IS_INVALID_ID, ExceptionConstants.LAST_QUOTED_REQUIRED_DATE_IS_INVALID_MESSAGE);
                }
            } else {
                throw new ExceptionDTO(ExceptionConstants.NO_USER_TO_SEARCH_QUOTES_ID, ExceptionConstants.NO_USER_TO_SEARCH_QUOTES_MESSAGE);
            }

            return quoteNotInUse;
        } catch (Exception) {
            console.trace(Exception);
            throw Exception;
        }
    }
}