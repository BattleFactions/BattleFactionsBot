import { applyRoles } from './roles/roles.handler';
import { registerCommands } from './commands/commands';
import { token } from './utils/utils';

const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.on('ready', async () => {
  // Register Commands
  registerCommands();
  // Add command handlers actions here
  await applyRoles(client);
  console.log('Bot is online!');
});

// Login to Discord with your client's token
client.login(token);
