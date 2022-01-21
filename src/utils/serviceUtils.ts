import { sendDeleteItem, sendGetItem, sendPutItem, sendQuery, sendUpdateItem } from '../aws/dynamodb/dynamoDBClient';
import {
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const TableName = process.env.BF_TABLE;

const getUpdateExpression = (fieldNames: string[]) => {
  const expression = fieldNames
    .map((fieldName) => {
      return `#${fieldName}=:${fieldName}`;
    })
    .join(',');
  return `SET ${expression}`;
};

const getExpressionAttributeNames = (fieldNames: string[]) => {
  const expressionAttributeNames = {};
  fieldNames.map((fieldName) => {
    expressionAttributeNames[`#${fieldName}`] = fieldName;
  });
  return expressionAttributeNames;
};

const getExpressionAttributeValues = (fieldNames: string[], entity: BattleFactions.Entity) => {
  const expressionAttributeValues = {};
  fieldNames.map((fieldName) => {
    expressionAttributeValues[`:${fieldName}`] = entity[fieldName];
  });
  return marshall(expressionAttributeValues);
};

const listIds = async <EntityType extends unknown>(
  PK: string,
  conditionExpression: string,
  listError: AppError,
  indexName: string = '',
) => {
  try {
    const PKKey = `:${indexName}PK`;
    const command = {
      TableName,
      KeyConditionExpression: conditionExpression,
      ExpressionAttributeValues: marshall({
        [PKKey]: PK,
      }),
      AttributesToGet: ['Id'],
    };
    if (indexName !== '') command['IndexName'] = indexName;
    return sendQuery<EntityType>(new QueryCommand(command));
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw listError;
    }
    throw error;
  }
};

const listEntities = async <EntityType extends unknown>(
  PK: string,
  SK: string,
  conditionExpression: string,
  listError: AppError,
  indexName: string = '',
) => {
  try {
    const PKKey = `:${indexName}PK`;
    const SKKey = `:${indexName}SK`;
    const command = {
      TableName,
      KeyConditionExpression: conditionExpression,
      ExpressionAttributeValues: marshall({
        [PKKey]: PK,
        [SKKey]: SK,
      }),
    };
    if (indexName !== '') command['IndexName'] = indexName;
    return sendQuery<EntityType>(new QueryCommand(command));
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw listError;
    }
    throw error;
  }
};

const createEntity = async <EntityType extends unknown>(
  entity: EntityType,
  createError: AppError,
  consumedCapacity: string = 'TOTAL',
): Promise<EntityType> => {
  try {
    await sendPutItem(
      new PutItemCommand({
        TableName,
        Item: marshall(entity),
        ConditionExpression: 'attribute_not_exists(#SK)',
        ExpressionAttributeNames: {
          '#SK': 'SK',
        },
        ReturnConsumedCapacity: consumedCapacity,
      }),
    );

    return entity;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw createError;
    }
    throw error;
  }
};

const readEntity = async <EntityType extends unknown>(
  PK: string,
  SK: string,
  readError: AppError,
): Promise<EntityType> => {
  try {
    return await sendGetItem<EntityType>(
      new GetItemCommand({
        TableName,
        Key: marshall({
          PK,
          SK,
        }),
      }),
    );
  } catch (error) {
    throw readError;
  }
};

const updateEntity = async (
  PK: string,
  SK: string,
  entity: BattleFactions.Entity,
  fieldNames: string[],
  updateError: AppError,
  consumedCapacity: string = 'TOTAL',
): Promise<BattleFactions.Id> => {
  try {
    await sendUpdateItem(
      new UpdateItemCommand({
        TableName,
        Key: marshall({ PK, SK }),
        UpdateExpression: getUpdateExpression(fieldNames),
        ExpressionAttributeNames: getExpressionAttributeNames(fieldNames),
        ExpressionAttributeValues: marshall(getExpressionAttributeValues(fieldNames, entity)),
        ReturnConsumedCapacity: consumedCapacity,
      }),
    );
    return entity.Id;
  } catch (error) {
    throw updateError;
  }
};

const deleteEntity = async (PK: string, SK: string, deleteError: AppError): Promise<boolean> => {
  try {
    return await sendDeleteItem(
      new DeleteItemCommand({
        TableName,
        Key: marshall({
          PK,
          SK,
        }),
      }),
    );
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw deleteError;
    }
    throw error;
  }
};

export { listIds, listEntities, createEntity, readEntity, updateEntity, deleteEntity };
