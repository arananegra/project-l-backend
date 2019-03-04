import * as express from "express";
import {QuotesRestService} from "./QuotesRestService";
import {UserRestService} from "./UserRestService";

export class MainServices {

    public constructor(applicationRouter: express.Router) {
        new QuotesRestService(applicationRouter);
        new UserRestService(applicationRouter);
    }
}