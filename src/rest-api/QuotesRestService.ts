import {ObjectID} from "mongodb";
import {QuoteBS} from "../bs/QuoteBS";
import {QuoteDTO} from "../domain/QuoteDTO";

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
                    console.log("Es un exceptionnnn del servicioo!!! !", Exception);
                    response.status(500).send(Exception);
                }
            }
        );
    }

    public test1() {
        this.app.get("/test", async (request, response) => {
                try {
                    let quoteBS = new QuoteBS();
                    let randomQuote = new QuoteDTO();
                    randomQuote = await quoteBS.getRandomQuote();

                    response.status(200).send(randomQuote);

                } catch (Exception) {
                    console.log("Es un exceptionnnn del servicioo!!! !", Exception);
                    response.status(500).send(Exception);
                }
            }
        );
    }
}