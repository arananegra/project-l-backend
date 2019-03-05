export class DatabaseConstants {
    public static DATABASE_NAME = "project-l-db";
    public static PROJECT_L_DATABASE_URL = process.env.PROJECT_L_DATABASE_URL;

    public static QUOTE_COLLECTION_NAME = "quotes";
    public static USER_COLLECTION_NAME = "users";

    public static ID_FIELD_NAME = "_id";

    public static USERNAME_FIELD_NAME = "username";
    public static EMAIL_FIELD_NAME = "email";
    public static PASSWORD_FIELD_NAME = "password";
    public static LAST_QUOTED_REQUIRED_DATE_FIELD_NAME = "lastQuoteRequiredDate";
    public static ALREADY_USED_QUOTES_FIELD_NAME = "alreadyUsedQuotes";

}