import { marshall } from '@aws-sdk/util-dynamodb';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { sendPutItem } from '../aws/dynamodb/dynamoDBClient';
import { userCreateError } from '../errors/errors';

const createUser = async (user: BattleFactions.User) => {
  try {
    await sendPutItem(
      new PutItemCommand({
        TableName: process.env.BF_TABLE,
        Item: marshall(user),
        ConditionExpression: 'attribute_not_exists(#SK)',
        ExpressionAttributeNames: {
          '#SK': 'SK',
        },
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );

    return user.Id;
  } catch (error) {
    throw userCreateError;
  }
};

export default {
  createUser,
};
