import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import "reflect-metadata";
import { MainServices } from "./src/rest-api/MainServices";

//Global variables declaration
let app = express();

//Global Router Declaration
let router = express.Router();

//User Helmet
app.use(helmet());

//Use Compression
app.use(compression());

//Handle Json Body
app.use(bodyParser.json({ limit: '50mb' }));

// Logs directory

//Enable CORS
app.use(cors());

//Url context before services name
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