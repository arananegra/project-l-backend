import * as express from "express";
import {UserRestService} from "./UserRestService";

export class MainServices {

    public constructor(applicationRouter: express.Router) {
        new UserRestService(applicationRouter);
    }
}