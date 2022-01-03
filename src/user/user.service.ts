import { marshall } from '@aws-sdk/util-dynamodb';
import { PutItemCommand, UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { sendGetItem, sendPutItem, sendUpdateItem } from '../aws/dynamodb/dynamoDBClient';
import { userCreateError, userReadError, userUpdateError } from '../errors/errors';

dayjs.extend(utc);

const getUser = async (userId: BattleFactions.Id): Promise<BattleFactions.UserEntity> => {
  const PK = 'USER';
  const SK = `USER_ID#${userId}`;

  try {
    return await sendGetItem<BattleFactions.UserEntity>(
      new GetItemCommand({
        TableName: process.env.BF_TABLE,
        Key: marshall({
          PK,
          SK,
        }),
      }),
    );
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw userReadError;
    }
    throw error;
  }
};

const createUser = async (user: BattleFactions.UserEntity) => {
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

const updateUser = async (user: BattleFactions.UserEntity) => {
  const PK = 'USER';
  const SK = `USER_ID#${user.Id}`;
  const now = dayjs.utc();

  try {
    await sendUpdateItem(
      new UpdateItemCommand({
        TableName: process.env.BF_TABLE,
        Key: marshall({ PK, SK }),
        UpdateExpression:
          'SET #wallets=:wallets, #name=:name, #email=:email, #phone=:phone, #country=:country, #dateOfBirth=:dateOfBirth, #updatedAt=:updatedAt',
        ExpressionAttributeNames: {
          '#wallets': 'Wallets',
          '#name': 'Name',
          '#email': 'Email',
          '#phone': 'Phone',
          '#country': 'Country',
          '#dateOfBirth': 'DateOfBirth',
          '#updatedAt': 'UpdatedAt',
        },
        ExpressionAttributeValues: marshall({
          ':wallets': user.Wallets,
          ':name': user.Name,
          ':email': user.Email,
          ':phone': user.Phone,
          ':country': user.Country,
          ':dateOfBirth': user.DateOfBirth,
          ':updatedAt': now.toISOString(),
        }),
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );

    return user.Id;
  } catch (error) {
    throw userUpdateError;
  }
};

export { createUser, getUser, updateUser };
