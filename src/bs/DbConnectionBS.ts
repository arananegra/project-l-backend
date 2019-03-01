import {MongoDBConnectionDAO} from "../dao/MongoDBConnectionDAO";
import {Client, Db} from "mongodb";
import {DatabaseConstants} from "../constants/DatabaseConstants";

export class DbConnectionBS {
    public static async getClient(): Promise<Client> {
        try {
            let daoInstance = await MongoDBConnectionDAO.getClientInstance();
            return daoInstance.getClient();
        } catch (exception) {
            throw exception;
        }
    }

    public static async getDbFromClient(client?: Client): Promise<Db> {
        try {
            let db: Db = null;
            if (client !== undefined) {
                db = client.db(DatabaseConstants.DATABASE_NAME);
            } else {
                let innerBuilderClient: Client = await this.getClient();
                db = innerBuilderClient.db(DatabaseConstants.DATABASE_NAME);
            }
            return db;

        } catch (exception) {
            throw exception;
        }
    }

    public static closeClient(clientReference: any) {
        if (clientReference) {
            clientReference.close();
        }
    }
}