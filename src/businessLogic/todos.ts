import * as uuid from 'uuid';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { Todo } from '../models/Todo';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { getUserId } from '../libs/utils';

const todoAccess = new TodoAccess();

export async function getAllTodos(): Promise<Todo[]> {
  return todoAccess.getAllTodos();
}

export async function getTodos(event: APIGatewayProxyEvent): Promise<Todo[]> {
  const userId = getUserId(event);
  return todoAccess.getTodos(userId);
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  event: APIGatewayProxyEvent
): Promise<Todo> {
  const todoId = uuid.v4();
  const userId = getUserId(event);

  return await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
  });
}
