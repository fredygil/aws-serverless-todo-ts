import {
  APIGatewayTokenAuthorizerEvent,
  CustomAuthorizerResult,
} from 'aws-lambda';
import 'source-map-support/register';

import { createLogger } from '../../libs/logger';
import * as JwtAuth from '../../libs/jwt';

const logger = createLogger('auth');

export const main = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken);

  try {
    const data = await JwtAuth.authenticate(event);
    logger.info('User authorized');
    return data;
  } catch (e) {
    logger.error('User not authorized', { error: e.message });

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
};
