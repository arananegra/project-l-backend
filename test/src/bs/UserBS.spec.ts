import "jest";
import 'reflect-metadata';
import { UserBS } from '../../../src/bs/UserBS';
import { UserDTO } from '../../../src/domain/UserDTO';
import { UserDAO } from "../../../src/dao/UserDAO";
jest.mock("bcryptjs");
import { hash } from "bcryptjs";
import { ExceptionConstants } from "../../../src/constants/ExceptionConstants";
import { ExceptionDTO } from "../../../src/domain/ExceptionDTO";

describe('src/bs/UserBS.ts register method', () => {
    let userBS: UserBS;
    beforeEach(() => {
        userBS = new UserBS();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('should return new registered user happy path', async () => {
        //prepare 
        hash.mockReturnValue(Promise.resolve("fdhfnvdwo24353mvefe"));

        let userToInsert: UserDTO = new UserDTO();
        userToInsert.email = "test@gmail.com";
        userToInsert.password = "1234test123";
        userToInsert.username = "testUser";
        let hashPassword = await hash(userToInsert.password, 10);

        let userFromRegister = {
            ...userToInsert,
            password: hashPassword
        };
        jest.spyOn(UserDAO.prototype, "searchUser").mockResolvedValue(null);
        jest.spyOn(UserDAO.prototype, "registerNewUser").mockResolvedValue(userFromRegister);

        //act
        let registeredUser = await userBS.registerNewUser(userToInsert)
        // Assert

        expect(userToInsert).toEqual(registeredUser);
    })

    it('should throw exception when no password is provided', async () => {
        //prepare 
        let userToInsert: UserDTO = new UserDTO();
        userToInsert.email = "test@gmail.com";
        userToInsert.username = "testUser";
        // Assert

        await expect(userBS.registerNewUser(userToInsert))
            .rejects
            .toThrowError(new ExceptionDTO(
                ExceptionConstants.NO_PASSWORD_PROVIDED_ID, 
                ExceptionConstants.NO_PASSWORD_PROVIDED_MESSAGE));
    })

    it('should throw exception when no password is provided', async () => {
        let userToInsert: UserDTO = new UserDTO();
        userToInsert.email = "test@gmail.com";
        userToInsert.password = "1234test123";
        userToInsert.username = "testUser";
        let hashPassword = await hash(userToInsert.password, 10);

        let userFromRegister = {
            ...userToInsert,
            password: hashPassword
        };
        jest.spyOn(UserDAO.prototype, "searchUser").mockResolvedValue([userToInsert]);
        // Assert
        await expect(userBS.registerNewUser(userToInsert))
            .rejects
            .toThrowError(new ExceptionDTO(
                ExceptionConstants.USER_ALREADY_EXISTS_ID, 
                ExceptionConstants.USER_ALREADY_EXISTS_MESSAGE));
    })
});

describe('src/bs/UserBS.ts login method', () => {
    let userBS: UserBS;
    beforeEach(() => {
        userBS = new UserBS();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('should return logged user happy path', async () => {
        //prepare 
        hash.mockReturnValue(Promise.resolve("fdhfnvdwo24353mvefe"));

        let userToInsert: UserDTO = new UserDTO();
        userToInsert.email = "test@gmail.com";
        userToInsert.password = "1234test123";
        userToInsert.username = "testUser";
        let hashPassword = await hash(userToInsert.password, 10);

        let userFromRegister = {
            ...userToInsert,
            password: hashPassword
        };
        jest.spyOn(UserDAO.prototype, "searchUser").mockResolvedValue(null);
        jest.spyOn(UserDAO.prototype, "registerNewUser").mockResolvedValue(userFromRegister);

        //act
        let registeredUser = await userBS.registerNewUser(userToInsert)
        // Assert

        expect(userToInsert).toEqual(registeredUser);
    })

    it('should throw exception when no password is provided', async () => {
        //prepare 
        let userToInsert: UserDTO = new UserDTO();
        userToInsert.email = "test@gmail.com";
        userToInsert.username = "testUser";
        // Assert

        await expect(userBS.registerNewUser(userToInsert))
            .rejects
            .toThrowError(new ExceptionDTO(
                ExceptionConstants.NO_PASSWORD_PROVIDED_ID, 
                ExceptionConstants.NO_PASSWORD_PROVIDED_MESSAGE));
    })

    it('should throw exception when no password is provided', async () => {
        let userToInsert: UserDTO = new UserDTO();
        userToInsert.email = "test@gmail.com";
        userToInsert.password = "1234test123";
        userToInsert.username = "testUser";
        let hashPassword = await hash(userToInsert.password, 10);

        let userFromRegister = {
            ...userToInsert,
            password: hashPassword
        };
        jest.spyOn(UserDAO.prototype, "searchUser").mockResolvedValue([userToInsert]);
        // Assert
        await expect(userBS.registerNewUser(userToInsert))
            .rejects
            .toThrowError(new ExceptionDTO(
                ExceptionConstants.USER_ALREADY_EXISTS_ID, 
                ExceptionConstants.USER_ALREADY_EXISTS_MESSAGE));
    })
});