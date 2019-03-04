import {ObjectID} from "mongodb";

export class QuotesRestService {
    private app: any;

    public constructor(app: any) {
        this.app = app;
        this.initializeUserRestServiceRoutes();
    }

    public initializeUserRestServiceRoutes() {
        this.test();
    }

    public test() {
        this.app.get("/test", async (request, response) => {
                try {
                    response.status(200).send({hello: "Hello"});

                } catch (Exception) {
                    console.log("Es un exceptionnnn del servicioo!!! !", Exception);
                    response.status(500).send(Exception);
                }
            }
        );
    }
}