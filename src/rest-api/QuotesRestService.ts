import {ObjectID} from "mongodb";
import {QuoteBS} from "../bs/QuoteBS";
import {QuoteDTO} from "../domain/QuoteDTO";
import {UserDTO} from "../domain/UserDTO";
import {ErrorMessagesConstants} from "../constants/ErrorMessagesConstants";

export class QuotesRestService {
    private app: any;

    public constructor(app: any) {
        this.app = app;
        this.initializeUserRestServiceRoutes();
    }

    public initializeUserRestServiceRoutes() {
        this.test();
        this.test1();
    }

    public test() {
        this.app.get("/random-quote", async (request, response) => {
                try {
                    let quoteBS = new QuoteBS();
                    let randomQuote = new QuoteDTO();
                    randomQuote = await quoteBS.getRandomQuote();

                    response.status(200).send(randomQuote);

                } catch (Exception) {
                    console.log(Exception);
                    response.status(500).send(Exception);
                }
            }
        );
    }

    public test1() {
        this.app.get("/test", async (request, response) => {
                try {
                    let quoteBS = new QuoteBS();
                    let notUsedQuote = new QuoteDTO();
                    let userRequesting = new UserDTO();

                    if (request.query.userId) {
                        userRequesting._id = request.query.userId;
                    } else {
                        response.status(412).send(new Error(ErrorMessagesConstants.MISSING_ID_FIELD));
                    }
                    notUsedQuote = await quoteBS.getQuoteNonInUseByUser(userRequesting);

                    if (notUsedQuote !== null) {
                        response.status(200).send(notUsedQuote);
                    } else {
                        response.status(404).send();
                    }

                } catch (Exception) {
                    console.log(Exception);
                    if (Exception.message === ErrorMessagesConstants.NO_USER_TO_SEARCH_QUOTES) {
                        response.status(412).send(ErrorMessagesConstants.NO_USER_TO_SEARCH_QUOTES);
                    } else {
                        response.status(500).send(Exception);
                    }
                }
            }
        );
    }
}