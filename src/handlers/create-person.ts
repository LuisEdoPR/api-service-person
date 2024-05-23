import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ApiHandler, logger, personService } from './api-handler';

export class CreatePerson extends ApiHandler {

    public async handleRequest(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        logger.info('Handling API call: CreatePerson');
        context.callbackWaitsForEmptyEventLoop = false;

        try {
            const person = ApiHandler.getPersonFromBody(event);
            const createdPerson = await personService.create(person);

            return ApiHandler.buildResponse(200, createdPerson);
        } catch (error) {
            return ApiHandler.buildErrorResponse('Error creating a new person', error);
        }
    }
}

export const handler = new CreatePerson().handleRequest;