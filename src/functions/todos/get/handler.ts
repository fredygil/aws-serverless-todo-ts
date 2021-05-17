import 'source-map-support/register';

import type {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getTodos } from '../../../businessLogic/todos';
import { getUserId } from '@libs/utils';

const getUserTodos: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event.headers.Authorization);
  const items = await getTodos(userId);
  return formatJSONResponse({ body: { items } });
};

export const main = middyfy(getUserTodos);
