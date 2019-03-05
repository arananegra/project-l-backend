import {ObjectID} from "mongodb";
import {ServiceConstants} from "../constants/ServiceConstants";
import {UserBS} from "../bs/UserBS";
import {UserDTO} from "../domain/UserDTO";
import * as jsonwebtoken from "jsonwebtoken"

export class UserRestService {
    private app: any;

    public constructor(app: any) {
        this.app = app;
        this.initializeUserRestServiceRoutes();
    }

    public initializeUserRestServiceRoutes() {
        this.loginUser();
        this.registerUser();
    }

    private loginUser() {
        this.app.post(ServiceConstants.LOGIN_ROUTE, async (request, response) => {
                try {
                    let userBS = new UserBS();
                    let userToLogin: UserDTO = new UserDTO();
                    userToLogin = {...userToLogin, ...request.body};

                    let resultOfLoginUser: UserDTO = await userBS.loginUser(userToLogin);
                    if (resultOfLoginUser !== null) {
                        let token = jsonwebtoken.sign({"email": userToLogin.email}, ServiceConstants.TOKEN_SECRET, {
                                expiresIn: '1h'
                            }
                        );
                        response.header(ServiceConstants.BEARER_NAME_CONSTANT, token);
                        response.status(200).send(resultOfLoginUser);
                    } else {
                        response.status(401).send("Wrong credentials provided");
                    }

                } catch (Exception) {
                    response.status(500).send(Exception);
                }
            }
        );
    }

    private registerUser() {
        this.app.post(ServiceConstants.REGISTER_ROUTE, async (request, response) => {
                try {
                    let userBS = new UserBS();
                    let userToRegister: UserDTO = new UserDTO();
                    userToRegister = {...userToRegister, ...request.body};

                    let resultOfRegisterUser = await userBS.registerNewUser(userToRegister);
                    if (resultOfRegisterUser !== null) {
                        let token = jsonwebtoken.sign({"email": userToRegister.email}, ServiceConstants.TOKEN_SECRET, {
                                expiresIn: '1h' //1h, 2d ...
                            }
                        );
                        response.header(ServiceConstants.BEARER_NAME_CONSTANT, token);
                        response.status(201).send(resultOfRegisterUser);
                    } else {
                        response.status(409).send("User already exists");
                    }

                } catch (Exception) {
                    console.log(Exception)
                    response.status(500).send(Exception);
                }
            }
        );
    }
}