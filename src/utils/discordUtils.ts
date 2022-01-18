import { Client, GuildMember, User } from 'discord.js';
import { guildId, headquartersRoleId, modRoleId } from '../utils/utils';

export const getListOfCurrentUsers = async (client: Client): Promise<User[]> => {
  const guild = await client.guilds.fetch(guildId);
  const members = await guild.members.fetch();

  const users = members.map((member) => {
    return member.user;
  });

  return users.filter((user) => !user.bot);
};

export const hasModPermissions = async (member: GuildMember | null) => {
  return member?.roles.cache.some((role) => {
    return role.id === headquartersRoleId || role.id === modRoleId;
  });
};
