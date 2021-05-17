import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'todos/{todoId}',
        cors: true,
        authorizer: 'auth',
      },
    },
  ],
};
