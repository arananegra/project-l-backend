import {ObjectID} from "mongodb";
import {QuoteBS} from "../bs/QuoteBS";
import {QuoteDTO} from "../domain/QuoteDTO";
import {UserDTO} from "../domain/UserDTO";
import {ExceptionConstants} from "../constants/ExceptionConstants";
import {ExceptionDTO} from "../domain/ExceptionDTO";

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
                        response.status(412).send(new ExceptionDTO(ExceptionConstants.MISSING_ID_FIELD_ID, ExceptionConstants.MISSING_ID_FIELD_MESSAGE));
                    }
                    notUsedQuote = await quoteBS.getQuoteNonInUseByUser(userRequesting);

                    if (notUsedQuote !== null) {
                        response.status(200).send(notUsedQuote);
                    } else {
                        response.status(404).send();
                    }

                } catch (Exception) {
                    if (Exception instanceof ExceptionDTO) {
                        if (Exception.code === ExceptionConstants.NO_USER_TO_SEARCH_QUOTES_ID) {
                            response.status(412).send(Exception);
                        }
                    } else {
                        response.status(500).send(Exception);
                    }
                }
            }
        );
    }
}