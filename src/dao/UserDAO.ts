import { Client, Db, ObjectID } from "mongodb";
import { DbConnectionBS } from "../bs/DbConnectionBS";
import { DatabaseConstants } from "../constants/DatabaseConstants";
import { ExceptionConstants } from "../constants/ExceptionConstants";
import { ExceptionDTO } from "../domain/ExceptionDTO";
import { UserSearcher } from "../domain/searchers/UserSearcher";
import { UserDTO } from "../domain/UserDTO";
import { hash } from "bcryptjs";

export class UserDAO {

    public async registerNewUser(userToInsert: UserDTO): Promise<UserDTO> {
        try {
            const usersCollection = await this.getUserCollection();
            let response = await usersCollection.insertOne(userToInsert);
            return response.ops[0];
        } catch (Exception) {
            console.trace(Exception);
            throw Exception;
        }
    }

    public async searchUser(userSearcher: UserSearcher, fullMatch?: boolean): Promise<Array<UserDTO>> {
        let userDTOfoundsToReturn: Array<UserDTO> = null;
        let mongoSearcher = [];

        const usersCollection = await this.getUserCollection();

        try {
            if (userSearcher.idCriteria !== null) {
                if (ObjectID.isValid(userSearcher.idCriteria)) {
                    mongoSearcher.push({ [DatabaseConstants.ID_FIELD_NAME]: new ObjectID(userSearcher.idCriteria) });
                } else {
                    throw new ExceptionDTO(ExceptionConstants.MONGO_ID_INVALID_ID, ExceptionConstants.MONGO_ID_INVALID_MESSAGE);
                }
            }

            if (userSearcher.usernameCriteria !== null) {
                mongoSearcher.push({ [DatabaseConstants.USERNAME_FIELD_NAME]: { $regex: `.*${userSearcher.usernameCriteria}.*` } });
            }

            if (userSearcher.emailCriteria !== null) {
                mongoSearcher.push({ [DatabaseConstants.EMAIL_FIELD_NAME]: { $regex: `.*${userSearcher.emailCriteria}.*` } });
            }
            let userFoundCursor;
            fullMatch ?
              userFoundCursor = await usersCollection.find({
                  $and: mongoSearcher
              }) :
              userFoundCursor = await usersCollection.find({
                  $or: mongoSearcher
              })

            let arrayOfFoundedUsers = await userFoundCursor.toArray();
            if (arrayOfFoundedUsers !== undefined && arrayOfFoundedUsers.length > 0) {
                userDTOfoundsToReturn = new Array<UserDTO>();
                arrayOfFoundedUsers.map((userFound: UserDTO) => {
                    userDTOfoundsToReturn.push(userFound);
                });
            }
            return userDTOfoundsToReturn;

        } catch (Exception) {
            console.trace(Exception);
            throw Exception;
        }
    }

    public async updateUser(userToUpdate: UserDTO): Promise<UserDTO> {
        try {
            let updateObject = {};
            const usersCollection = await this.getUserCollection();
            if (ObjectID.isValid(userToUpdate._id)) {

                if (userToUpdate.username !== null) {
                    updateObject[DatabaseConstants.USERNAME_FIELD_NAME] = userToUpdate.username;
                }

                if (userToUpdate.email !== null) {
                    updateObject[DatabaseConstants.EMAIL_FIELD_NAME] = userToUpdate.email;
                }

                if (userToUpdate.password !== null) {
                    updateObject[DatabaseConstants.PASSWORD_FIELD_NAME] = await hash(userToUpdate.password, 10);
                }

                if (userToUpdate.alreadyUsedQuotes !== null) {
                    updateObject[DatabaseConstants.ALREADY_USED_QUOTES_FIELD_NAME] = userToUpdate.alreadyUsedQuotes
                }

                if (userToUpdate.lastQuoteRequiredDate !== null) {
                    updateObject[DatabaseConstants.LAST_QUOTED_REQUIRED_DATE_FIELD_NAME] = userToUpdate.lastQuoteRequiredDate
                }

                await usersCollection.updateOne(
                  { [DatabaseConstants.ID_FIELD_NAME]: new ObjectID(userToUpdate._id) },
                  {
                      $set: updateObject
                  },
                  { w: "majority", wtimeout: 100 }
                );
                return userToUpdate;
            } else {
                throw new ExceptionDTO(ExceptionConstants.MONGO_ID_INVALID_ID, ExceptionConstants.MONGO_ID_INVALID_MESSAGE);
            }


        } catch (Exception) {
            console.trace(Exception);
            throw Exception;
        }
    }

    private async getUserCollection() {
        const client: Client = await DbConnectionBS.getClient()
          .catch((clientException) => {
              throw clientException;
          });

        const db: Db = await DbConnectionBS.getDbFromClient(client);
        const usersCollection = db.collection(DatabaseConstants.USER_COLLECTION_NAME);
        return usersCollection;
    }
}
