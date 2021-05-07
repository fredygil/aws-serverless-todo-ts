import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import todos from './mock';

const getTodos: APIGatewayProxyHandler = async (event) => {
  return formatJSONResponse({
    todos,
  });
};

export const main = middyfy(getTodos);
