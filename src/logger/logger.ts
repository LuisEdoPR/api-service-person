import bunyan from 'bunyan';
import { Logger, StructureLogFields } from './definitions';

export interface HandlerContext {
    logger: Logger;
    awsAccountId?: string,
    userId?: string,
    traceId?: string,
}

let apiLogger: ApiLogger;

export class ApiLogger implements HandlerContext {

    private _logger?: Logger;

    constructor(
        readonly awsAccountId?: string,
        readonly userId?: string,
        readonly traceId?: string,
    ) { }


    public createLogger(name: string): Logger {
        return bunyan.createLogger({
            name,
            [StructureLogFields.AWS_ACCOUNT_ID]: this.awsAccountId,
            [StructureLogFields.USER_ID]: this.userId,
            [StructureLogFields.TRACE_ID]: this.traceId,
        })
    }

    get logger(): Logger {
        if (!this._logger) {
            this._logger = this.createLogger('person');
        }
        return this._logger;
    }

}

export const globalLogger = (): Logger => {
    if (!apiLogger) {
        apiLogger = new ApiLogger();
    }
    return apiLogger.logger;
};