import {DbConnectionBS} from "../bs/DbConnectionBS";
import {QuoteDTO} from "../domain/QuoteDTO";

export class UserRestService {
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

                    let quoteDTO = new QuoteDTO();

                    let connection = await DbConnectionBS.getConnection();

                    //quoteDTO._id = new ObjectID();
                    quoteDTO.message = "hola";
                    connection.collection("testCollection").insertOne(quoteDTO);
                    let results = await connection.collection("testCollection").find({}).toArray();
                    response.status(200).send(JSON.stringify(results));

                } catch (Exception) {
                    console.log("Es un exceptionnnn del servicioo!!! !", Exception);
                    response.status(500).send(Exception);
                }
            }
        );
    }
}