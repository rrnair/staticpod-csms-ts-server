import { ApplicationException } from "./application-exception";

/**
 * A resource not found exception
 */
export class NotFoundException extends ApplicationException {
    

    constructor(message: string) {
        
        // Set HTTP 404 - Not Found error code
        super(message, 404);
    }
}