import 'source-map-support/register';

import type {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { UpdateTodoRequest } from '../../../requests/UpdateTodoRequest';
import { updateTodo } from '../../../businessLogic/todos';

const updateTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { todoId } = event.pathParameters;
  const todoRequest: UpdateTodoRequest = JSON.parse(event.body);

  try {
    await updateTodo(todoId, todoRequest, event);
    return formatJSONResponse({
      statusCode: 200,
      body: {},
    });
  } catch (e) {
    return formatJSONResponse({
      statusCode: 500,
      body: { error: e },
    });
  }
};

export const main = middyfy(updateTodoHandler);
