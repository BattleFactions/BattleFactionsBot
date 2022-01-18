import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { userCreateError, userDeleteError, userReadError, userUpdateError } from '../errors/errors';
import { createEntity, deleteEntity, readEntity, updateEntity } from '../utils/serviceUtils';

dayjs.extend(utc);

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

export { createUser, readUser, updateUser, deleteUser };
