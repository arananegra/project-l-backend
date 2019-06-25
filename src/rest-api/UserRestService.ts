import * as jsonwebtoken from "jsonwebtoken";
import { UserBS } from "../bs/UserBS";
import { ExceptionConstants } from "../constants/ExceptionConstants";
import { ServiceConstants } from "../constants/ServiceConstants";
import { ExceptionDTO } from "../domain/ExceptionDTO";
import { UserSearcher } from "../domain/searchers/UserSearcher";
import { UserDTO } from "../domain/UserDTO";

export class UserRestService {
    private app: any;

    public constructor(app: any) {
        this.app = app;
        this.initializeUserRestServiceRoutes();
    }

    public initializeUserRestServiceRoutes() {
        this.loginUser();
        this.registerUser();
        this.searchUser();
    }

    private loginUser() {
        this.app.post(ServiceConstants.LOGIN_ROUTE, async (request, response) => {
              try {
                  let userBS = new UserBS();
                  let userToLogin: UserDTO = new UserDTO();
                  userToLogin = { ...userToLogin, ...request.body };

                  let resultOfLoginUser: UserDTO = await userBS.loginUser(userToLogin);
                  let token = jsonwebtoken.sign({ "email": userToLogin.email }, ServiceConstants.TOKEN_SECRET, {
                      expiresIn: '1h'
                  });
                  response.header(ServiceConstants.BEARER_NAME_CONSTANT, token);
                  response.status(200).send(resultOfLoginUser);


              } catch (Exception) {
                  if (Exception.code !== undefined || Exception.code !== null) {
                      if (Exception.code === ExceptionConstants.NO_PASSWORD_PROVIDED_MESSAGE) {
                          response.status(412).send(Exception);
                      } else if (Exception.code === ExceptionConstants.WRONG_CREDENTIALS_PROVIDED_ID) {
                          response.status(401).send(new ExceptionDTO(ExceptionConstants.WRONG_CREDENTIALS_PROVIDED_ID,
                            ExceptionConstants.WRONG_CREDENTIALS_PROVIDED_MESSAGE));
                      }
                  } else {
                      response.status(500).send(Exception);
                  }
              }
          }
        );
    }

    private registerUser() {
        this.app.post(ServiceConstants.REGISTER_ROUTE, async (request, response) => {
              try {
                  let userBS = new UserBS();
                  let userToRegister: UserDTO = new UserDTO();
                  userToRegister = { ...userToRegister, ...request.body };

                  let resultOfRegisterUser = await userBS.registerNewUser(userToRegister);
                  if (resultOfRegisterUser !== null) {
                      let token = jsonwebtoken.sign({ "email": userToRegister.email }, ServiceConstants.TOKEN_SECRET, {
                            expiresIn: '1h' //1h, 2d ...
                        }
                      );
                      response.header(ServiceConstants.BEARER_NAME_CONSTANT, token);
                      response.status(201).send(resultOfRegisterUser);
                  }

              } catch (Exception) {
                  if (Exception.code !== undefined || Exception.code !== null) {
                      if (Exception.code === ExceptionConstants.NO_PASSWORD_PROVIDED_ID) {
                          response.status(412).send(Exception);
                      } else if (Exception.code === ExceptionConstants.USER_ALREADY_EXISTS_ID) {
                          response.status(409).send(Exception);
                      }
                  } else {
                      response.status(500).send(Exception);
                  }
              }
          }
        );
    }

    private searchUser() {
        this.app.get(ServiceConstants.SEARCH_USER, async (request, response) => {
              try {
                  let userBS = new UserBS();
                  let userSearcher: UserSearcher = new UserSearcher();

                  if (request.query.id) {
                      userSearcher.idCriteria = request.query.id;
                  }

                  if (request.query.username) {
                      userSearcher.usernameCriteria = request.query.username;
                  }

                  if (request.query.email) {
                      userSearcher.emailCriteria = request.query.email;
                  }

                  let foundedUsers = await userBS.searchUser(userSearcher);

                  if (foundedUsers !== null) {
                      response.status(200).send(foundedUsers);
                  } else {
                      response.status(404).send();
                  }

              } catch (Exception) {
                  response.status(500).send(Exception);
              }
          }
        );
    }
}