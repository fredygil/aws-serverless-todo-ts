import 'source-map-support/register';

import type {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import * as AWS from 'aws-sdk';
import uuid from 'uuid';
import { middyfy } from '@libs/lambda';
import { CreateTodoRequest } from '../../../requests/CreateTodoRequest';
import { createTodo } from '../../../businessLogic/todos';

const todosTable = process.env.TODOS_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();

const createTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const newItem = await createTodo(newTodo, event);

  return formatJSONResponse({
    statusCode: 201,
    body: {
      newItem,
    },
  });
};

export const main = middyfy(createTodoHandler);
