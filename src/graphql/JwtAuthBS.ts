import {AuthChecker} from "type-graphql";
import * as jsonwebtoken from "jsonwebtoken";
import {ExpressContext} from "../..";
import {ServiceConstants} from "../constants/ServiceConstants";


export const authChecker: AuthChecker<ExpressContext> = async ({ context: { req, res } }) => {
    try {

        let decodedPayload = jsonwebtoken.verify(req.headers[ServiceConstants.BEARER_NAME_CONSTANT], ServiceConstants.TOKEN_SECRET);

        if (decodedPayload !== null && decodedPayload !== undefined) {
            await refreshAuth(req.headers[ServiceConstants.BEARER_NAME_CONSTANT], res);
            return true;
        } else {
            return false
        }

    } catch (e) {
        return false;
    }
};


export const refreshAuth = async (token: string, res) => {
    try {
        let tokenDecoded: any = jsonwebtoken.decode(token, {json: true});
        let refreshedToken = jsonwebtoken.sign({"email": tokenDecoded.email}, ServiceConstants.TOKEN_SECRET, {
                expiresIn: '1h'
            }
        );
        res.header(ServiceConstants.BEARER_NAME_CONSTANT, refreshedToken);

    } catch (e) {
        return false;
    }


};