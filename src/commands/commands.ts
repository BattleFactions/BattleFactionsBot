import { REST } from '@discordjs/rest';
import { clientId, guildId, token } from '../utils/utils';
import { bfVerifyCommand } from './bfVerify';
import { bfLinkEthCommand } from './bfLinkEth';
const { Routes } = require('discord-api-types/v9');

export const registerCommands = () => {
  const commands = [bfVerifyCommand(), bfLinkEthCommand()].map((command) => command.toJSON());

  const rest = new REST({ version: '9' }).setToken(token);

  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
};
