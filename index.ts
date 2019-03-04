import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import "reflect-metadata";
import * as jwt from "express-jwt"
import {MainServices} from "./src/rest-api/MainServices";
import {ServiceConstants} from "./src/constants/ServiceConstants";

//Global variables declaration
let app = express();

//Global Router Declaration
let router = express.Router();

//User Helmet
app.use(helmet());

//Use Compression
app.use(compression());

//Handle Json Body
app.use(bodyParser.json({limit: '50mb'}));

//Enable CORS
app.use(cors());

// JWT Security middleware
let jwtCheck = jwt({
    secret: ServiceConstants.TOKEN_SECRET,
    getToken: (req) => {
        if (req.headers[ServiceConstants.BEARER_NAME_CONSTANT]) {
            return req.headers[ServiceConstants.BEARER_NAME_CONSTANT];
        } else {
            return null;
        }
    }
}).unless({
    path: [ServiceConstants.BASE_API + ServiceConstants.REGISTER_ROUTE,
        ServiceConstants.BASE_API + ServiceConstants.LOGIN_ROUTE]
});

// Enable the use of the jwtCheck middleware in all of our routes
app.use(jwtCheck);

// Function fallback for Auth errors

app.use(function (err, req, res, next) {
    if (err.constructor.name === 'UnauthorizedError') {
        res.status(401).send(err);
    }
});


//Url context before services username
app.use('/api', router);

//Server configuration
let server = app.listen(process.env.PORT || 3000, () => {
    let host: string = (server as any).address().address;
    let port: number = (server as any).address().port;

    console.log(`App Listening at http://${host}:${port}`);
});


//Routes objects instantiation
//let sumService = new MultiplyService(app);
new MainServices(router);

//Export for testing purpose
module.exports = app;