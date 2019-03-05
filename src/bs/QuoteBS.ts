import {QuoteDTO} from "../domain/QuoteDTO";
import {DbConnectionBS} from "./DbConnectionBS";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import {Client, Db, Collection} from "mongodb";
import {QuoteDAO} from "../dao/QuoteDAO";
import {UserDTO} from "../domain/UserDTO";

export class QuoteBS {
    private quoteDAO;

    constructor() {
        this.quoteDAO = new QuoteDAO();
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
            const db: Db = await DbConnectionBS.getDbFromClient(client);
            const quotesCollection = db.collection(DatabaseConstants.QUOTE_COLLECTION_NAME);
            return await this.quoteDAO.getQuoteNonInUseByUser(quotesCollection, userToCheckUsedQuotes);
        } catch (Exception) {
            throw Exception;
        }
    }
}