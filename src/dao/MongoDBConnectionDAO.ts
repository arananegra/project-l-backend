import {Client} from "mongodb"
import {DatabaseConstants} from "../constants/DatabaseConstants";

let MongoClient = require('mongodb').MongoClient;

export class MongoDBConnectionDAO {
    private static _instance: MongoDBConnectionDAO = new MongoDBConnectionDAO();
    private _mongoClient: Client = null;

    public constructor() {
        if (MongoDBConnectionDAO._instance) {
            throw new Error("Error: Instantiation failed: Use MongoDBConnectionDAO.getClientInstance() instead of new.");
        }
        MongoDBConnectionDAO._instance = this;
    }

    public static async getClientInstance(): Promise<MongoDBConnectionDAO> {
        try {
            if (this._instance._mongoClient == null) {
                this._instance._mongoClient = await MongoClient.connect(DatabaseConstants.PROJECT_L_DATABASE_URL, {
                    useNewUrlParser: true
                });
                console.log("POOL FIRST INSTANCE");
                return MongoDBConnectionDAO._instance;

            } else {
                console.log("POOL FROM MEMORY");
                return MongoDBConnectionDAO._instance;
            }

        } catch (Exception) {
            throw Exception;
        }
    }

    public getClient(): Client {
        return this._mongoClient;
    }
}