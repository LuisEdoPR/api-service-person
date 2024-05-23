export interface Logger {
    trace(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    child(args: any[]): Logger;
}

// All fields required to include in logs
export enum StructureLogFields {
    AWS_ACCOUNT_ID = 'awsAccountId',
    USER_ID = 'userId',
    TRACE_ID = 'traceId',
}