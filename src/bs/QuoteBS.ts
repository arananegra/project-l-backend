import {QuoteDTO} from "../domain/QuoteDTO";
import {DbConnectionBS} from "./DbConnectionBS";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import {Client, Db, Collection} from "mongodb";
import {QuoteDAO} from "../dao/QuoteDAO";
import {UserDTO} from "../domain/UserDTO";
import {UserBS} from "./UserBS";
import {UserSearcher} from "../domain/searchers/UserSearcher";
import {ErrorMessagesConstants} from "../constants/ErrorMessagesConstants";

export class QuoteBS {
    private quoteDAO;
    private userBS;

    constructor() {
        this.quoteDAO = new QuoteDAO();
        this.userBS = new UserBS();
    }

    public async getRandomQuote(): Promise<QuoteDTO> {
        const client: Client = await DbConnectionBS.getClient()
            .catch((clientException) => {
                throw clientException;
            });

        try {
            const db: Db = await DbConnectionBS.getDbFromClient(client);
            const quotesCollection = db.collection(DatabaseConstants.QUOTE_COLLECTION_NAME);
            return await this.quoteDAO.getRandomQuote(quotesCollection);
        } catch (Exception) {
            throw Exception;
        }
    }

    public async getQuoteNonInUseByUser(userToCheckUsedQuotes: UserDTO): Promise<QuoteDTO> {
        const client: Client = await DbConnectionBS.getClient()
            .catch((clientException) => {
                throw clientException;
            });

        try {
            let quoteNonInUse = null;
            const db: Db = await DbConnectionBS.getDbFromClient(client);
            const quotesCollection = db.collection(DatabaseConstants.QUOTE_COLLECTION_NAME);
            let userSearcher = new UserSearcher();
            userSearcher.idCriteria = userToCheckUsedQuotes._id;
            let userToCheckWithFilledFieldsArray = await this.userBS.getUsersBySearcher(userSearcher);
            let singleUserCheckWithFilledField = userToCheckWithFilledFieldsArray[0];
            if (singleUserCheckWithFilledField !== null && singleUserCheckWithFilledField !== undefined) {
                if (singleUserCheckWithFilledField.alreadyUsedQuotes === null) {
                    singleUserCheckWithFilledField.alreadyUsedQuotes = [];
                }
                quoteNonInUse = await this.quoteDAO.getQuoteNonInUseByUser(quotesCollection, singleUserCheckWithFilledField);
            } else {
                throw new Error(ErrorMessagesConstants.NO_USER_TO_SEARCH_QUOTES);
            }

            return quoteNonInUse;
        } catch (Exception) {
            throw Exception;
        }
    }
}