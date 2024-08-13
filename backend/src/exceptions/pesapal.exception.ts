import { Logger } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";

export class PesapalServiceException extends ExceptionsHandler {
    private logger = new Logger(PesapalServiceException.name);
    /**
     * Constructs a new instance of the ModelException class.
     *
     * @param {any} error - The error object that occurred.
     */
    constructor(error: any) {
        super(error);
        // Log the error object as a stringified JSON.
        // This is useful for debugging purposes.
        this.logger.error(JSON.stringify(error));
    }
}