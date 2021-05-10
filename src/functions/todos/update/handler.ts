import 'source-map-support/register';

import type {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import * as AWS from 'aws-sdk';
import { middyfy } from '@libs/lambda';

const todosTable = process.env.TODOS_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();

const updateTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { todoId } = event.pathParameters;
  const { name, dueDate, done } = JSON.parse(JSON.stringify(event.body));

  console.log(`Update todo id: ${todoId}`);
  console.log(`Update data: `, event.body);

  // Validate todoId
  if (!todoExists(todoId)) {
    return formatJSONResponse({
      statusCode: 404,
      body: {
        error: 'Todo does not exist',
      },
    });
  }

  // Update
  const updateItem = {
    TableName: todosTable,
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
  const result = await docClient.update(updateItem).promise();
  const item = result.Attributes;

  return formatJSONResponse({
    statusCode: 201,
    body: {
      item,
    },
  });
};

const todoExists = async (todoId: string) => {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: { todoId },
    })
    .promise();
  return !!result.Item;
};

export const main = middyfy(updateTodoHandler);
