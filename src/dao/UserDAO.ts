import {compare, hash} from "bcryptjs"
import {Collection, Db, Session} from "mongodb";
import {UserDTO} from "../domain/UserDTO";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import {UserSearcher} from "../domain/searchers/UserSearcher";

export class UserDAO {

    private async checkIfUserExists(collectionReference: Collection, userSearcher: UserSearcher): Promise<UserDTO> {
        let userDTOfoundToReturn: UserDTO = null;
        let mongodbFindUserByUsernameCriteria: string = null;
        let mongodbFindUserByEmailCriteria: string = null;

        try {

            if (userSearcher.usernameCriteria !== null) {
                mongodbFindUserByUsernameCriteria = userSearcher.usernameCriteria;
            }

            if (userSearcher.emailCriteria !== null) {
                mongodbFindUserByEmailCriteria = userSearcher.emailCriteria;
            }

            let userFoundCursor = await collectionReference.find({
                $or: [
                    {[DatabaseConstants.EMAIL_FIELD_NAME]: mongodbFindUserByEmailCriteria},
                    {[DatabaseConstants.USERNAME_FIELD_NAME]: mongodbFindUserByUsernameCriteria}
                ]
            });

            let arrayOfFoundedUsers = await userFoundCursor.toArray();

            if (arrayOfFoundedUsers !== undefined && arrayOfFoundedUsers.length > 0) {
                arrayOfFoundedUsers.map((userFound: UserDTO) => {
                    userDTOfoundToReturn = new UserDTO();
                    userDTOfoundToReturn = {...userFound};
                });
            }
            return userDTOfoundToReturn;

        } catch (Exception) {
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
            throw Exception;
        }
    }

    public async loginUser(connectionReference: Db, userToVerify: UserDTO): Promise<UserDTO> {
        try {
            let userSearcherFromNewInsertRequest = new UserSearcher();
            userSearcherFromNewInsertRequest.usernameCriteria = userToVerify.username;
            userSearcherFromNewInsertRequest.emailCriteria = userToVerify.email;
            let userFromDb = await this.checkIfUserExists(connectionReference, userSearcherFromNewInsertRequest);
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
            throw Exception;
        }
    }
}
