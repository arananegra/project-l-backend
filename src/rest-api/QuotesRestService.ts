import {DbConnectionBS} from "../bs/DbConnectionBS";
import {QuoteDTO} from "../domain/QuoteDTO";
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

    private async transfer(from, to, amount) {
        const client = await DbConnectionBS.getClient()
            .catch((clientException) => {
                throw clientException;
            });

        const session = client.startSession();
        session.startTransaction();
        try {
            let db = await DbConnectionBS.getDbFromClient(client);
            const opts = { session, returnOriginal: false };
            const A = await db.collection('Account').
            findOneAndUpdate({ name: from }, { $inc: { balance: -amount } }, opts).
            then(res => res.value);
            if (A.balance < 0) {
                // If A would have negative balance, fail and abort the transaction
                // `session.abortTransaction()` will undo the above `findOneAndUpdate()`
                throw new Error('Insufficient funds: ' + (A.balance + amount));
            }

            const B = await db.collection('Account').
            findOneAndUpdate({ name: to }, { $inc: { balance: amount } }, opts).
            then(res => res.value);

            await session.commitTransaction();
            session.endSession();
            return { from: A, to: B };
        } catch (error) {
            // If an error occurred, abort the whole transaction and
            // undo any changes that might have happened
            await session.abortTransaction();
            session.endSession();
            throw error; // Rethrow so calling function sees error
        }
    }

    private async test1() {
        const client = await DbConnectionBS.getClient()
            .catch((clientException) => {
                throw clientException;
            });

        try {
            let db = await DbConnectionBS.getDbFromClient(client);

            await db.dropDatabase();

            await db.collection('Account').insertMany([
                { name: 'A', balance: 5 },
                { name: 'B', balance: 10 }
            ]);

            let coso = await db.collection('Account').find({}).toArray();
            console.log(coso)

            await this.transfer('A', 'B', 4); // Success
            let coso1 = await db.collection('Account').find({}).toArray();
            return(coso1)
            try {
                // Fails because then A would have a negative balance
                //await this.transfer('A', 'B', 2);
            } catch (error) {
                throw error; // "Insufficient funds: 1"
            }

        } catch (e) {
            throw e;
        }
    }

    public test() {
        this.app.get("/test", async (request, response) => {
                try {
                    response.status(200).send(JSON.stringify(await this.test1()));

                } catch (Exception) {
                    console.log("Es un exceptionnnn del servicioo!!! !", Exception);
                    response.status(500).send(Exception);
                }
            }
        );
    }
}