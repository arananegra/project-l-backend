import * as express from "express";
import {QuotesRestService} from "./QuotesRestService";

export class MainServices {

    public constructor(applicationRouter: express.Router) {
        new QuotesRestService(applicationRouter);
    }
}