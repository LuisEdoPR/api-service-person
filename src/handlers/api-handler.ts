import { PersonService } from '../services/person';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { PersonInput } from '../models/person.model';
import { globalLogger } from '../logger/logger';
import { BussinessException } from '../models/exceptions/bussiness-exception';
import { isProdEnvironment } from '../utils/environment';

type ResponseBody = PersonInput[] | PersonInput | string | undefined;

const RESPONSE_HEADERS = { "Content-Type": "text/json" };

export const personService = new PersonService();
export const logger = globalLogger();

export abstract class ApiHandler {

    abstract handleRequest(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>;

    protected static getPersonFromBody(event: APIGatewayProxyEvent): PersonInput {
        if (!event.body) {
            throw new BussinessException(400, 'Person data is required');
        }
        return JSON.parse(event.body) as PersonInput;
    }

    protected static getPersonIdFromPathParams(event: APIGatewayProxyEvent): string {
        if (!event.pathParameters?.id) {
            throw new BussinessException(400, 'Person Id is required');
        }
        return event.pathParameters.id;
    }

    protected static getPage(event: APIGatewayProxyEvent): number {
        const page = event.queryStringParameters?.page ? parseInt(event.queryStringParameters.page, 10) : 1;

        if (isNaN(page) || page <= 0) {
            throw new BussinessException(400, 'Page must be positive integer');
        }
        return page;
    }

    protected static getLimit(event: APIGatewayProxyEvent): number {
        const limit = event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit, 10) : 10;

        if (isNaN(limit) || limit <= 0) {
            throw new BussinessException(400, 'Limit must be positive integer');
        }
        return limit;
    }

    protected static buildResponse(statusCode: number, body?: ResponseBody): APIGatewayProxyResult {
        return {
            statusCode,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(body),
        };
    }

    protected static buildResponsePaginated(
        statusCode: number,
        body: ResponseBody,
        page: number,
        limit: number,
        total: number
    ): APIGatewayProxyResult {
        return {
            statusCode,
            body: JSON.stringify({
                data: body,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            }),
        };
    }

    protected static buildErrorResponse(message: string, error: any): APIGatewayProxyResult {
        logger.error(message, error);
        const isProd = isProdEnvironment();
        if (error instanceof BussinessException) {
            return {
                statusCode: error.statusCode,
                headers: RESPONSE_HEADERS,
                body: JSON.stringify({
                    message,
                    details: error.message,
                    stack: !isProd ? error.stack : ''
                }),
            };
        } else if (error instanceof Error) {
            return {
                statusCode: 500,
                headers: RESPONSE_HEADERS,
                body: JSON.stringify({
                    message,
                    details: error.message,
                    stack: !isProd ? error.stack : ''
                }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal Server Error', details: 'Unexpected error' }),
            };
        }
    }

}