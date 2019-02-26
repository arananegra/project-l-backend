export class UserRestService {
    private app: any;

    public constructor(app: any) {
        this.app = app;
        this.initializeUserRestServiceRoutes();
    }

    public initializeUserRestServiceRoutes() {
        this.test();
    }

    public test() {
        this.app.get("/test", async (request, response) => {
                try {
                    response.status(200).send({hello: "Hello world"})
                } catch (Exception) {
                    console.trace(Exception);
                    response.status(500).send();
                }
            }
        );
    }
}