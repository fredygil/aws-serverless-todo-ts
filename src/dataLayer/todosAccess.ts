import * as AWS from 'aws-sdk';
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

// const XAWS = AWSXRay.captureAWS(AWS)

import { Todo } from '../models/Todo';

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(): Promise<Todo[]> {
    console.log('Getting all todos');

    const result = await this.docClient
      .scan({
        TableName: this.todosTable,
      })
      .promise();

    const items = result.Items;
    return items as Todo[];
  }

  // Todos for the authorized user
  async getTodos(userId: string): Promise<Todo[]> {
    console.log('Getting todos for user ', userId);
    const userIdIndex = process.env.USER_ID_INDEX;

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        ScanIndexForward: false,
      })
      .promise();

    const items = result.Items;
    return items as Todo[];
  }

  async createTodo(todo: Todo): Promise<Todo> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo,
      })
      .promise();

    return todo;
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    const { todoId, userId, name, dueDate, done } = todo;

    if (!this.userTodoExists(todoId, userId))
      throw new Error('Todo does not exists or not authorized');

    // Update
    const updateItem = {
      TableName: this.todosTable,
      Key: {
        todoId,
      },
      ExpressionAttributeNames: {
        '#todo_name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': name,
        ...(dueDate ? { ':dueDate': dueDate } : {}),
        ...(done ? { ':done': done } : {}),
      },
      UpdateExpression: `SET #todo_name = :name ${
        dueDate ? ', dueDate = :dueDate' : ''
      } ${done ? ', done = :done' : ''}`,
      ReturnValues: 'ALL_NEW',
    };
    console.log('Update info: ', updateItem);
    await this.docClient.update(updateItem).promise();

    return todo;
  }

  // Check if todo exists and belongs to the user
  async userTodoExists(todoId: string, userId: string): Promise<boolean> {
    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: { todoId },
      })
      .promise();
    return !!result.Item && result?.Item?.userId === userId;
  }
}

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient();
}
