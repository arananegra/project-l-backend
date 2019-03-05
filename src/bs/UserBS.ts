import {Client, Db, Session} from "mongodb";
import {UserDAO} from "../dao/UserDAO";
import {UserDTO} from "../domain/UserDTO";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import {DbConnectionBS} from "./DbConnectionBS";
import {UserSearcher} from "../domain/searchers/UserSearcher";

export class UserBS {
    private userDAO: UserDAO;

    public constructor() {
        this.userDAO = new UserDAO();
    }

    public async registerNewUser(userToInsert: UserDTO): Promise<UserDTO> {
        const client: Client = await DbConnectionBS.getClient()
            .catch((clientException) => {
                throw clientException;
            });
        const session = client.startSession({readPreference: {mode: "primary"}});
        try {
            const db: Db = await DbConnectionBS.getDbFromClient(client);
            db.createCollection(DatabaseConstants.USER_COLLECTION_NAME);
            const usersCollection = db.collection(DatabaseConstants.USER_COLLECTION_NAME);
            session.startTransaction({
                readConcern: {level: 'snapshot'},
                writeConcern: {w: 'majority'},
                readPreference: 'primary'
            });

            let userRegistered = await this.userDAO.registerNewUser(usersCollection, userToInsert, session);
            await DbConnectionBS.commitWithRetry(session);
            return userRegistered;

        } catch (Exception) {
            if (Exception.errorLabels && Exception.errorLabels.indexOf('TransientTransactionError') >= 0) {
                console.log('TransientTransactionError, retrying transaction ...');
                await this.registerNewUser(userToInsert);
            } else {
                await session.abortTransaction();
                throw Exception;
            }
        }
    }

    public async loginUser(userToVerify: UserDTO): Promise<UserDTO> {
        const client: Client = await DbConnectionBS.getClient()
            .catch((clientException) => {
                throw clientException;
            });

        try {
            const db: Db = await DbConnectionBS.getDbFromClient(client);
            const usersCollection = db.collection(DatabaseConstants.USER_COLLECTION_NAME);
            return await this.userDAO.loginUser(usersCollection, userToVerify);
        } catch (Exception) {
            throw Exception;
        }
    }

    public async getUsersBySearcher(userToSearch: UserSearcher): Promise<Array<UserDTO>> {
        const client: Client = await DbConnectionBS.getClient()
            .catch((clientException) => {
                throw clientException;
            });

        try {
            const db: Db = await DbConnectionBS.getDbFromClient(client);
            const usersCollection = db.collection(DatabaseConstants.USER_COLLECTION_NAME);
            return await this.userDAO.getUsersBySearcher(usersCollection, userToSearch);
        } catch (Exception) {
            throw Exception;
        }
    }
}