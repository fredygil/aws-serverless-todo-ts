import 'source-map-support/register';

import type {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import * as AWS from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { getTodos } from '../../../businessLogic/todos';

const todosTable = process.env.TODOS_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();

const getUserTodos: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const items = await getTodos(event);
  return formatJSONResponse({ body: { items } });
};

export const main = middyfy(getUserTodos);
