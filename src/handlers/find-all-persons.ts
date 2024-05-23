import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ApiHandler, logger, personService } from './api-handler';

export class FindAllPersons extends ApiHandler {

    public async handleRequest(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        logger.info('Handling API call: findAllPersons');
        context.callbackWaitsForEmptyEventLoop = false;

        try {
            const page = ApiHandler.getPage(event);
            const limit = ApiHandler.getLimit(event);

            const { persons, total } = await personService.findAll(page, limit);
            return ApiHandler.buildResponsePaginated(200, persons, page, limit, total);
        } catch (error) {
            return ApiHandler.buildErrorResponse('Error finding all persons', error);
        }
    }
}

export const handler = new FindAllPersons().handleRequest;