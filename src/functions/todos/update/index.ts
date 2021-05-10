import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'patch',
        path: 'todos/{todoId}',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
