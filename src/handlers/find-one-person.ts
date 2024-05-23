import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ApiHandler, logger, personService } from './api-handler';

export class FindOnePerson extends ApiHandler {

    public async handleRequest(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        logger.info('Handling API call: FindOnePerson');
        context.callbackWaitsForEmptyEventLoop = false;

        try {
            const personId = ApiHandler.getPersonIdFromPathParams(event);
            const person = await personService.findById(personId);
            return ApiHandler.buildResponse(200, person);
        } catch (error) {
            return ApiHandler.buildErrorResponse('Error finding person by Id', error);
        }
    }

}

export const handler = new FindOnePerson().handleRequest;