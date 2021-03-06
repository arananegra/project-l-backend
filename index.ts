import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import "reflect-metadata";
import * as jwt from "express-jwt"
import {buildSchema} from "type-graphql";
import * as jsonwebtoken from "jsonwebtoken";
import {MainServices} from "./src/rest-api/MainServices";
import {ServiceConstants} from "./src/constants/ServiceConstants";
import {ApolloServer} from "apollo-server";
import * as path from "path";
import {UserResolver} from "./src/graphql/resolvers/UserResolver";
import {authChecker} from "./src/graphql/JwtAuthBS";
import {formatError} from "graphql";
import {QuoteResolver} from "./src/graphql/resolvers/QuoteResolver";

export interface ExpressContext {
    req: any;
    res: any;
}


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
    if (err.name === 'UnauthorizedError') {
        res.status(401).send(err);
    }
});

// Refresh token on any successful request (not 401 or 500)
app.use(function refreshToken(request: express.Request, response: express.Response, next) {
    if (response.statusCode != 401
        && response.statusCode != 500) {
        if (request.headers[ServiceConstants.BEARER_NAME_CONSTANT]) {
            let tokenDecoded: any = jsonwebtoken.decode(request.headers[ServiceConstants.BEARER_NAME_CONSTANT].toString(), {json: true});
            let token = jsonwebtoken.sign({"email": tokenDecoded.email}, ServiceConstants.TOKEN_SECRET, {
                    expiresIn: '1h' //1h, 2d ...
                }
            );
            response.header(ServiceConstants.BEARER_NAME_CONSTANT, token);
        }

        next();
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


// **********************
// *                    *
// *     GRAPQH QL      *
// *                    *
// **********************


const GRAPHQL_PORT = 3001;


async function test(): Promise<void> {
    try {
        const schema = await buildSchema({
            resolvers: [UserResolver, QuoteResolver],
            // automatically create `schema.gql` file with schema definition in current folder
            emitSchemaFile: path.resolve("./", "schema.graphql"),
            validate: false,
            authChecker: authChecker

        });

        // Create GraphQL server
        const server = new ApolloServer({
            schema,
            context: (context: ExpressContext) => {
                return context;
            }
        });

        // Start the server
        const {url} = await server.listen(GRAPHQL_PORT);
        console.log(`Server is running, GraphQL Playground available at ${url}`);
    } catch (e) {
        console.log("error", e);
    }
}

new MainServices(router);

test().then(() => {

}).catch((error) => console.log(error));

//Export for testing purpose
module.exports = app;