import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getUserId } from '@libs/utils';
import { middyfy } from '@libs/lambda';
import { deleteTodo } from '../../../businessLogic/todos';

const deleteTodoHandler: APIGatewayProxyHandler = async (event) => {
  const { todoId } = event.pathParameters;
  const userId = getUserId(event.headers.Authorization);

  try {
    await deleteTodo(todoId, userId);
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

export const main = middyfy(deleteTodoHandler);
