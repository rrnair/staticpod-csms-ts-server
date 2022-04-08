
export abstract class ApplicationException {

    private code: number;

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