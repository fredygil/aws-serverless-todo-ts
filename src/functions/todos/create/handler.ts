import 'source-map-support/register';

import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway';

import { getUserId } from '@libs/utils';
import { middyfy } from '@libs/lambda';
import { CreateTodoRequest } from '../../../requests/CreateTodoRequest';
import { createTodo } from '../../../businessLogic/todos';

import schema from './schema';

const createTodoHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    const userId = getUserId(event.headers.Authorization);
    const newTodo: CreateTodoRequest = {
      name: event.body.name,
      dueDate: event.body.dueDate,
    };
    const item = await createTodo(newTodo, userId);

    return formatJSONResponse({
      statusCode: 201,
      body: {
        item,
      },
    });
  };

export const main = middyfy(createTodoHandler);
