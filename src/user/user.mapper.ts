import { User } from 'discord.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const userMapper = (user: User): BattleFactions.UserEntity => {
  return {
    Entity: BattleFactions.TypesEnum.User,
    PK: 'USER',
    SK: `USER_ID#${user.id}`,
    Id: user.id,
    Username: user.username,
    Discriminator: user.discriminator,
    Avatar: user.avatar,
    CreatedAt: dayjs(user.createdAt).toISOString(),
  };
};
