import {Db} from "mongodb"
import {MongoDBConfigurationDTO} from "../domain/MongoDBConfigurationDTO";

let MongoClient = require('mongodb').MongoClient;

export class MongoDBConnectionPoolDAO {
    private static _instance: MongoDBConnectionPoolDAO = new MongoDBConnectionPoolDAO();
    private _connectionPool: Db = null;

    public constructor() {
        if (MongoDBConnectionPoolDAO._instance) {
            throw new Error("Error: Instantiation failed: Use MongoDBConnectionPoolDAO.getInstance() instead of new.");
        }
        MongoDBConnectionPoolDAO._instance = this;
    }

    public static getInstance(configurationPool: MongoDBConfigurationDTO): Promise<MongoDBConnectionPoolDAO> {
        try {
            return new Promise<MongoDBConnectionPoolDAO>(async (resolve, reject) => {
                if (this._instance._connectionPool == null) {
                    MongoClient.connect(configurationPool.clientReference, { useNewUrlParser: true }, (err, client) => {
                        if (err) reject(err);
                        else {
                            this._instance._connectionPool = client.db(configurationPool.databaseName);
                            console.log("POOL FIRST INSTANCE");
                            resolve(MongoDBConnectionPoolDAO._instance);
                        }
                    });

                } else {
                    console.log("POOL FROM MEMORY");
                    resolve(MongoDBConnectionPoolDAO._instance);
                }
            });

        } catch (Exception) {
            throw new Exception;
        }
    }


    public getConnectionPool(): Db {
        return this._connectionPool;
    }
}