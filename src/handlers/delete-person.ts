import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ApiHandler, logger, personService } from './api-handler';

export class DeletePerson extends ApiHandler {

    public async handleRequest(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        logger.info('Handling API call: DeletePerson');
        context.callbackWaitsForEmptyEventLoop = false;

        try {
            const personId = ApiHandler.getPersonIdFromPathParams(event);
            await personService.delete(personId);
            return ApiHandler.buildResponse(204);
        } catch (error) {
            return ApiHandler.buildErrorResponse('Error deleting person', error);
        }
    }
}

export const handler = new DeletePerson().handleRequest;
