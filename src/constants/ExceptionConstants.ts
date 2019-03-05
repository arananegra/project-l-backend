export class ExceptionConstants {
    public static MISSING_ID_FIELD_MESSAGE: string = "The id field is missing";
    public static MISSING_ID_FIELD_ID: number = -1;

    public static NO_USER_TO_SEARCH_QUOTES_MESSAGE: string = "The user you are requesting quotes does not exists on the DB";
    public static NO_USER_TO_SEARCH_QUOTES_ID: number = -2;

    public static USER_ALREADY_EXISTS_MESSAGE: string = "User already exists on the db";
    public static USER_ALREADY_EXISTS_ID: number = -3;

    public static LAST_QUOTED_REQUIRED_DATE_IS_INVALID_MESSAGE: string = "The last quote required date is invalid: probably " +
        "the user has requested a new quote before 24h";
    public static LAST_QUOTED_REQUIRED_DATE_IS_INVALID_ID: number = -4;
}