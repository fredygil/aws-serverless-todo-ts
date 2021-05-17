import 'source-map-support/register';

import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUserId } from '@libs/utils';
import { middyfy } from '@libs/lambda';
import { UpdateTodoRequest } from '../../../requests/UpdateTodoRequest';
import { updateTodo } from '../../../businessLogic/todos';

import schema from './schema';

const updateTodoHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    const { todoId } = event.pathParameters;
    const userId = getUserId(event.headers.Authorization);

    const todoRequest: UpdateTodoRequest = {
      name: event.body.name,
      dueDate: event.body.dueDate,
      done: event.body.done,
    };

    try {
      await updateTodo(todoRequest, todoId, userId);
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
