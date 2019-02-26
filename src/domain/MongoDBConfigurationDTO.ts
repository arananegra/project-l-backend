export class MongoDBConfigurationDTO {
    private _clientReference: string;
    private _databaseName: string;


    public constructor() {
        this._clientReference = null;
        this._databaseName = null;
    }

    set clientReference(value: string) {
        this._clientReference = value;
    }

    set databaseName(value: string) {
        this._databaseName = value;
    }

    get clientReference(): string {
        return this._clientReference;
    }

    get databaseName(): string {
        return this._databaseName;
    }
}