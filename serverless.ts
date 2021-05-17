import type { AWS } from '@serverless/typescript';

import auth from '@functions/auth';
import getTodos from '@functions/todos/get';
import createTodo from '@functions/todos/create';
import updateTodo from '@functions/todos/update';

const stage = "${opt:stage, 'dev'}";
const region = 'us-east-1';

const serverlessConfiguration: AWS = {
  service: 'aws-sls-todo-ts',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    stage,
    region,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TODOS_TABLE: 'Todos-${self:service}-${self:provider.stage}',
      USER_ID_INDEX: 'UserIndex',
      AUTH_0_TOKEN_ISSUER: 'https://dev-caieyu5z.us.auth0.com',
      AUTH_0_JWKS_URL:
        'https://dev-caieyu5z.us.auth0.com/.well-known/jwks.json',
      AUTH_0_AUDIENCE: 'http://localhost:3000',
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:Query',
            ],
            Resource:
              'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}',
          },
          {
            Effect: 'Allow',
            Action: 'dynamodb:Query',
            Resource:
              'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}/index/${self:provider.environment.USER_ID_INDEX}',
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { auth, getTodos, createTodo, updateTodo },
  resources: {
    Resources: {
      TodosDynamoDBTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            { AttributeName: 'todoId', AttributeType: 'S' },
            { AttributeName: 'createdAt', AttributeType: 'S' },
            { AttributeName: 'userId', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'todoId', KeyType: 'HASH' },
            { AttributeName: 'createdAt', KeyType: 'RANGE' },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: '${self:provider.environment.USER_ID_INDEX}',
              KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
              Projection: { ProjectionType: 'ALL' },
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: '${self:provider.environment.TODOS_TABLE}',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
