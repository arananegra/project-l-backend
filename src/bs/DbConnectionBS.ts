import {MongoDBConnectionDAO} from "../dao/MongoDBConnectionDAO";
import {Client, Db, Session} from "mongodb";
import {DatabaseConstants} from "../constants/DatabaseConstants";

export class DbConnectionBS {
    public static async getClient(): Promise<Client> {
        try {
            let daoInstance = await MongoDBConnectionDAO.getClientInstance();
            return daoInstance.getClient();
        } catch (Exception) {
            throw Exception;
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

        } catch (Exception) {
            throw Exception;
        }
    }

    public static closeClient(clientReference: any) {
        if (clientReference) {
            clientReference.close();
        }
    }

    public static async commitWithRetry(session: Session) {
        try {
            await session.commitTransaction();
        } catch (Exception) {
            if (
              Exception.errorLabels &&
              Exception.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0
            ) {
                console.log('UnknownTransactionCommitResult, retrying commit operation ...');
                await this.commitWithRetry(session);
            } else {
                console.log('Error during commit ...');
                console.trace(Exception);
                throw Exception;
            }
        }
    }

}