import {
  BatchWriteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// Update our AWS Connection Details
const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
});

export const sendQuery = async <EntityType extends unknown>(command: QueryCommand): Promise<EntityType[]> => {
  const commandOutput = await client.send(command);

  return (commandOutput?.Items || []).map((item) => unmarshall(item)) as EntityType[];
};

export const sendGetItem = async <EntityType extends unknown>(command: GetItemCommand): Promise<EntityType> => {
  const commandOutput = await client.send(command);
  const entity = commandOutput?.Item ? unmarshall(commandOutput.Item) : undefined;

  return entity as EntityType;
};

export const sendPutItem = async (command: PutItemCommand): Promise<boolean> => {
  const commandOutput = await client.send(command);

  const capacityUnits = commandOutput.ConsumedCapacity?.CapacityUnits;

  return capacityUnits ? Promise.resolve(capacityUnits > 0) : Promise.reject(false);
};

export const sendUpdateItem = async (command: UpdateItemCommand) => {
  const commandOutput = await client.send(command);

  const capacityUnits = commandOutput.ConsumedCapacity?.CapacityUnits;

  return capacityUnits ? capacityUnits > 0 : false;
};

export const sendBatchWriteItem = async (command: BatchWriteItemCommand) => {
  const commandOutput = await client.send(command);

  return commandOutput.UnprocessedItems;
};
