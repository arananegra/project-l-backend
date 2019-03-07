import {compare, hash} from "bcryptjs"
import {Collection, Db, Session, ObjectID} from "mongodb";
import {UserDTO} from "../domain/UserDTO";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import {UserSearcher} from "../domain/searchers/UserSearcher";
import {ExceptionDTO} from "../domain/ExceptionDTO";
import {ExceptionConstants} from "../constants/ExceptionConstants";

export class UserDAO {

    private async checkIfUserExists(collectionReference: Collection, userSearcher: UserSearcher): Promise<UserDTO> {
        let userDTOfoundToReturn: UserDTO = null;
        let mongodbFindUserByEmailCriteria: string = null;

        try {
            if (userSearcher.emailCriteria !== null) {
                mongodbFindUserByEmailCriteria = userSearcher.emailCriteria;
            }

            let userFoundCursor = await collectionReference.find({
                [DatabaseConstants.EMAIL_FIELD_NAME]: mongodbFindUserByEmailCriteria
            });

            let arrayOfFoundedUsers = await userFoundCursor.toArray();

            if (arrayOfFoundedUsers !== undefined && arrayOfFoundedUsers.length > 0) {
                arrayOfFoundedUsers.map((userFound: UserDTO) => {
                    userDTOfoundToReturn = new UserDTO();
                    userDTOfoundToReturn = {...userDTOfoundToReturn, ...userFound};
                });
            }
            return userDTOfoundToReturn;

        } catch (Exception) {
            console.trace(Exception);
            throw Exception;
        }
    }

    public async registerNewUser(collectionReference: Collection, userToInsert: UserDTO, session?: Session): Promise<UserDTO> {
        try {
            let userSearcherFromNewInsertRequest = new UserSearcher();
            userSearcherFromNewInsertRequest.usernameCriteria = userToInsert.username;
            userSearcherFromNewInsertRequest.emailCriteria = userToInsert.email;
            let userFromDb = await this.checkIfUserExists(collectionReference, userSearcherFromNewInsertRequest);
            if (userFromDb === null) {
                userToInsert.password = await hash(userToInsert.password, 10);
                let response = await collectionReference.insertOne(userToInsert, {session});
                return response.ops[0];
            } else {
                return null;
            }
        } catch (Exception) {
            console.trace(Exception);
            throw Exception;
        }
    }

    public async loginUser(collectionReference: Collection, userToVerify: UserDTO): Promise<UserDTO> {
        try {
            let userSearcherFromNewInsertRequest = new UserSearcher();
            userSearcherFromNewInsertRequest.usernameCriteria = userToVerify.username;
            userSearcherFromNewInsertRequest.emailCriteria = userToVerify.email;
            let userFromDb = await this.checkIfUserExists(collectionReference, userSearcherFromNewInsertRequest);
            if (userFromDb !== null) {
                let compareResult = await compare(userToVerify.password, userFromDb.password);
                if (compareResult) {
                    return userFromDb;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (Exception) {
            console.trace(Exception);
            throw Exception;
        }
    }

    public async searchUser(collectionReference: Collection, userSearcher: UserSearcher): Promise<Array<UserDTO>> {
        let userDTOfoundsToReturn: Array<UserDTO> = new Array<UserDTO>();
        let mongoSearcher = [];
        try {
            if (userSearcher.idCriteria !== null) {
                if (ObjectID.isValid(userSearcher.idCriteria)) {
                    mongoSearcher.push({[DatabaseConstants.ID_FIELD_NAME]: new ObjectID(userSearcher.idCriteria)});
                } else {
                    throw new ExceptionDTO(ExceptionConstants.MONGO_ID_INVALID_ID, ExceptionConstants.MONGO_ID_INVALID_MESSAGE);
                }
            }

            if (userSearcher.usernameCriteria !== null) {
                mongoSearcher.push({[DatabaseConstants.USERNAME_FIELD_NAME]: {$regex: `.*${userSearcher.usernameCriteria}.*`}});
            }

            if (userSearcher.emailCriteria !== null) {
                mongoSearcher.push({[DatabaseConstants.EMAIL_FIELD_NAME]: {$regex: `.*${userSearcher.emailCriteria}.*`}});
            }

            let userFoundCursor = await collectionReference.find({
                $and: mongoSearcher
            });

            let arrayOfFoundedUsers = await userFoundCursor.toArray();
            if (arrayOfFoundedUsers !== undefined && arrayOfFoundedUsers.length > 0) {
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

    public async updateUser(collectionReference: Collection, userToUpdate: UserDTO): Promise<UserDTO> {
        try {
            let updateObject = {};

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
                let result = await collectionReference.updateOne(
                    {[DatabaseConstants.ID_FIELD_NAME]: new ObjectID(userToUpdate._id)},
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
}
