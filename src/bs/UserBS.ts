import { compare, hash } from "bcryptjs";
import { ExceptionConstants } from "../constants/ExceptionConstants";
import { UserDAO } from "../dao/UserDAO";
import { ExceptionDTO } from "../domain/ExceptionDTO";
import { UserSearcher } from "../domain/searchers/UserSearcher";
import { UserDTO } from "../domain/UserDTO";

export class UserBS {
    private userDAO: UserDAO;

    public constructor() {
        this.userDAO = new UserDAO();
    }

    public async registerNewUser(userToInsert: UserDTO): Promise<UserDTO> {
        try {
            if (userToInsert.password === undefined || userToInsert.password === null) {
                throw new ExceptionDTO(ExceptionConstants.NO_PASSWORD_PROVIDED_ID, ExceptionConstants.NO_PASSWORD_PROVIDED_MESSAGE)
            }
            let userSearcherToCheckIfExists = new UserSearcher();
            userSearcherToCheckIfExists.emailCriteria = userToInsert.email;
            userSearcherToCheckIfExists.usernameCriteria = userToInsert.username;

            let userThatExists = await this.userDAO.searchUser(userSearcherToCheckIfExists, false);

            if (userThatExists !== null) {
                throw new ExceptionDTO(ExceptionConstants.USER_ALREADY_EXISTS_ID, ExceptionConstants.USER_ALREADY_EXISTS_MESSAGE);
            }

            userToInsert.password = await hash(userToInsert.password, 10);

            let userRegistered = await this.userDAO.registerNewUser(userToInsert);
            return userRegistered;

        } catch (Exception) {
            throw Exception;
        }
    }

    public async loginUser(userToVerify: UserDTO): Promise<UserDTO> {
        try {
            let userSearcherToCheckIfExists = new UserSearcher();
            userSearcherToCheckIfExists.emailCriteria = userToVerify.email;
            userSearcherToCheckIfExists.usernameCriteria = userToVerify.username;


            let usersFromDb = await this.userDAO.searchUser(userSearcherToCheckIfExists);
            let singleUserFromDB = usersFromDb[0];
            if (singleUserFromDB !== null) {
                let compareResult = await compare(userToVerify.password, singleUserFromDB.password);
                if (compareResult) {
                    return singleUserFromDB;
                } else {
                    throw new ExceptionDTO(ExceptionConstants.WRONG_CREDENTIALS_PROVIDED_ID,
                      ExceptionConstants.WRONG_CREDENTIALS_PROVIDED_MESSAGE);
                }
            } else {
                throw new ExceptionDTO(ExceptionConstants.WRONG_CREDENTIALS_PROVIDED_ID,
                  ExceptionConstants.WRONG_CREDENTIALS_PROVIDED_MESSAGE);
            }
        } catch (Exception) {
            throw Exception;
        }
    }

    public async searchUser(userSearcher: UserSearcher): Promise<Array<UserDTO>> {
        try {
            return await this.userDAO.searchUser(userSearcher);
        } catch (Exception) {
            throw Exception;
        }
    }

    public async updateUser(userToUpdate: UserDTO): Promise<UserDTO> {
        try {
            return await this.userDAO.updateUser(userToUpdate);
        } catch (Exception) {
            throw Exception;
        }
    }
}