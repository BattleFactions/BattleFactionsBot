import { REST } from '@discordjs/rest';
const { Routes } = require('discord-api-types/v9');
import { clientId, guildId, token } from '../utils/utils';
import { bfVerifyCommand } from './bfVerify';

export const registerCommands = () => {
  const commands = [bfVerifyCommand()].map((command) => command.toJSON());

  const rest = new REST({ version: '9' }).setToken(token);

  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
};
