import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { listUsersIdsError, userCreateError, userDeleteError, userReadError, userUpdateError } from '../errors/errors';
import { createEntity, deleteEntity, listIds, readEntity, updateEntity } from '../utils/serviceUtils';

dayjs.extend(utc);

const listUsersIds = async () => {
  const keyConditionExpression = 'PK = :PK';
  return listIds('USER', keyConditionExpression, listUsersIdsError);
};

const createUser = async (user: BattleFactions.UserEntity) => {
  return createEntity(user, userCreateError);
};

const readUser = async (userId: BattleFactions.Id): Promise<BattleFactions.UserEntity> => {
  const PK = 'USER';
  const SK = `USER_ID#${userId}`;
  return readEntity(PK, SK, userReadError);
};

const updateUser = async (user: BattleFactions.UserEntity) => {
  const PK = 'USER';
  const SK = `USER_ID#${user.Id}`;
  user.UpdatedAt = dayjs.utc().toISOString();
  return updateEntity(PK, SK, user, ['Name', 'Email', 'Phone', 'Country', 'DateOfBirth', 'UpdatedAt'], userUpdateError);
};

const deleteUser = async (userId: BattleFactions.Id) => {
  const PK = 'USER';
  const SK = `USER_ID#${userId}`;
  return deleteEntity(PK, SK, userDeleteError);
};

export { listUsersIds, createUser, readUser, updateUser, deleteUser };
