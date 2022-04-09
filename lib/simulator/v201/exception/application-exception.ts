
/**
 * Custom application error thats minimzed to show in the UI. Extend this abstract class for all custom errors
 */
export abstract class ApplicationException {

    // A HTTP Error code
    private code: number;

    // Error message
    private message: string;

    constructor(message: string, code: number) {
        this.code = code;
        this.message = message;
    }

    public getCode(): number {
        return this.code;
    }

    public getMessage(): string {
        return this.message;
    }

}