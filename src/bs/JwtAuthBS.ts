import {AuthChecker} from "type-graphql";
import * as jsonwebtoken from "jsonwebtoken";
import {ExpressContext} from "../../index";
import {ServiceConstants} from "../constants/ServiceConstants";


export const authChecker: AuthChecker<ExpressContext> = async ({context: ExpressContext}) => {
    try {
        // @ts-ignore
        let decodedPayload = jsonwebtoken.verify(req.headers[ServiceConstants.BEARER_NAME_CONSTANT], ServiceConstants.TOKEN_SECRET);

        if (decodedPayload !== null && decodedPayload !== undefined) {
            // @ts-ignore
            await refreshAuth(req.headers[ServiceConstants.BEARER_NAME_CONSTANT], res);
            return true;
        }


    } catch (e) {
        return false;
    }
};


export const refreshAuth = async (token: string, res) => {
    try {
        let tokenDecoded: any = jsonwebtoken.decode(token, {json: true});
        let refreshedToken = jsonwebtoken.sign({"email": tokenDecoded.email}, ServiceConstants.TOKEN_SECRET, {
                expiresIn: '1h' //1h, 2d ...
            }
        );
        res.header(ServiceConstants.BEARER_NAME_CONSTANT, refreshedToken);

    } catch (e) {
        return false;
    }


};