import * as uuid from 'uuid';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { Todo } from '../models/Todo';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { getUserId } from '../libs/utils';

const todoAccess = new TodoAccess();

export async function getAllTodos(): Promise<Todo[]> {
  return todoAccess.getAllTodos();
}

export async function getTodos(userId: string): Promise<Todo[]> {
  return todoAccess.getTodos(userId);
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<Todo> {
  const todoId = uuid.v4();

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

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<Object> {
  console.log(`Update todo id: ${todoId}`);
  console.log(`Update todo userId: ${userId}`);
  console.log(`Update todo data: `, updateTodoRequest);

  return await todoAccess.updateTodo({
    todoId,
    userId,
    ...updateTodoRequest,
  });
}
