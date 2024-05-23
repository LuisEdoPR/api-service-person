import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ApiHandler, logger, personService } from './api-handler';

export class UpdatePerson extends ApiHandler {

    public async handleRequest(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        logger.info('Handling API call: CreatePerson');
        context.callbackWaitsForEmptyEventLoop = false;

        try {
            const person = ApiHandler.getPersonFromBody(event);
            const personId = ApiHandler.getPersonIdFromPathParams(event);
            const updatedPerson = await personService.update(person, personId);
            return ApiHandler.buildResponse(200, updatedPerson);
        } catch (error) {
            return ApiHandler.buildErrorResponse('Error updating a new person', error);
        }
    }
}

export const handler = new UpdatePerson().handleRequest;
