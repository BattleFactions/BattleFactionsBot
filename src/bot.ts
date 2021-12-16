import { applyRoles } from './roles/roles.handler';
import { registerCommands } from './commands/commands';
import { apiAddress, token } from './utils/utils';
import { generateListOfHolders } from './holders/holders.handler';
import { ImmutableXClient } from '@imtbl/imx-sdk';

const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', async () => {
  // Configure IMX Client
  const imxClient = await ImmutableXClient.build({ publicApiUrl: apiAddress });

  // Register Commands
  registerCommands();
  // Add command handlers actions here
  await applyRoles(client, imxClient);
  await generateListOfHolders(client, imxClient);
  console.log('Bot is online!');
});

// Login to Discord with your client's token
client.login(token);
