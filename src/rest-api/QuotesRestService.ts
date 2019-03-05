import {ObjectID} from "mongodb";
import {QuoteBS} from "../bs/QuoteBS";
import {QuoteDTO} from "../domain/QuoteDTO";
import {UserDTO} from "../domain/UserDTO";
import {ExceptionConstants} from "../constants/ExceptionConstants";
import {ExceptionDTO} from "../domain/ExceptionDTO";
import {ServiceConstants} from "../constants/ServiceConstants";

export class QuotesRestService {
    private app: any;

    public constructor(app: any) {
        this.app = app;
        this.initializeUserRestServiceRoutes();
    }

    public initializeUserRestServiceRoutes() {
        this.getNewQuoteForUser();
    }

    public getNewQuoteForUser() {
        this.app.get(ServiceConstants.GET_NEW_QUOTE, async (request, response) => {
                try {
                    let quoteBS = new QuoteBS();
                    let notUsedQuote = new QuoteDTO();
                    let userRequesting = new UserDTO();

                    if (request.query.userId) {
                        userRequesting._id = request.query.userId;
                    } else {
                        response.status(412).send(new ExceptionDTO(ExceptionConstants.MISSING_ID_FIELD_ID, ExceptionConstants.MISSING_ID_FIELD_MESSAGE));
                    }
                    notUsedQuote = await quoteBS.getQuoteNotInUseByUser(userRequesting);

                    if (notUsedQuote !== null) {
                        response.status(200).send(notUsedQuote);
                    } else {
                        response.status(404).send();
                    }

                } catch (Exception) {
                    if (Exception instanceof ExceptionDTO) {
                        if (Exception.code === ExceptionConstants.NO_USER_TO_SEARCH_QUOTES_ID
                            || Exception.code === ExceptionConstants.LAST_QUOTED_REQUIRED_DATE_IS_INVALID_ID) {
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