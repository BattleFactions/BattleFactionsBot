import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { sendPutItem } from '../aws/dynamodb/dynamoDBClient';

export const pendingPromise = new Promise(() => {
  // this is a pending promise that does nothing
});

// export const fakeAuthorizationHeader = (userId, loginId?) => {
//   const token = sign(
//     {
//       sub: userId,
//       email: loginId || 'test@yourdev.life',
//     },
//     'foo',
//   );
//
//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

export const putItem = async (entity: BattleFactions.Entity) =>
  sendPutItem(
    new PutItemCommand({
      TableName: process.env.BF_TABLE,
      Item: marshall(entity, { removeUndefinedValues: true }),
      ReturnConsumedCapacity: 'TOTAL',
    }),
  );
