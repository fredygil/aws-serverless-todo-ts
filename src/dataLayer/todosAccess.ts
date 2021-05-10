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
}

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient();
}
