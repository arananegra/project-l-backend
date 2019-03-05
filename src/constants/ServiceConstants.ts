export class ServiceConstants {
    public static TOKEN_SECRET = process.env.PROJECT_L_TOKEN_SECRET;

    public static LOGIN_ROUTE: string = "/login";
    public static REGISTER_ROUTE: string = "/register";
    public static SEARCH_USER: string = "/search-user";
    public static GET_NEW_QUOTE: string = "/get-new-quote";
    public static BASE_API: string = "/api";
    public static BEARER_NAME_CONSTANT: string = "bearer";
}