import {MongoDBConfigurationDTO} from "../domain/MongoDBConfigurationDTO";
import {MongoDBConnectionPoolDAO} from "../dao/MongoDBConnectionPoolDAO";
import {ServiceConstants} from "../constants/ServiceConstants";
import {Db} from "mongodb";
import {DatabaseConstants} from "../constants/DatabaseConstants";

export class DbConnectionBS {

    public static async getConnection(): Promise<Db> {
        return new Promise<Db>(async (resolve, reject) => {
            try {
                let configurationPool: MongoDBConfigurationDTO = new MongoDBConfigurationDTO();

                configurationPool.clientReference = process.env.PROJECT_L_DATABASE;
                configurationPool.databaseName = DatabaseConstants.PRO_DATABASE;
                let daoInstace = await MongoDBConnectionPoolDAO.getInstance(configurationPool);
                resolve(daoInstace.getConnectionPool())

            } catch (exception) {
                reject(exception);
            }
        })
    }

    public static closeConnection(connectionReference: any) {
        if (connectionReference) {
            connectionReference.close();
        }
    }
}