import { ImmutableXClient } from '@imtbl/imx-sdk';
import { Agenda } from 'agenda';
import { apiAddress, token } from './utils/utils';
import { registerCommands } from './commands/commands';
import { applyRoles } from './roles/roles.handler';
import { verifyRoles } from './roles/verify.handler';
import { generateListOfHolders } from './holders/holders.handler';
import { linkEth } from './link/linkEth.handler';
import { generateListOfCurrentUsers } from './user/user.handler';
import { getWalletsStatuses } from './wallets/wallet.handler';
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});

client.on('ready', async () => {
  try {
    // Configure IMX Client
    const imxClient = await ImmutableXClient.build({ publicApiUrl: apiAddress });

    // Instance for cron jobs
    const agenda = new Agenda();

    // Register Commands
    registerCommands();
    // Add command handlers actions here
    await applyRoles(client, imxClient);
    await linkEth(client, imxClient);
    await generateListOfCurrentUsers(client);
    await generateListOfHolders(client, imxClient);
    await getWalletsStatuses(client, imxClient);
    await verifyRoles(client, imxClient, agenda);

    console.log('Bot is online!');
  } catch (e) {
    console.log('An error occurred:', e);
  }
});

// Login to Discord with your client's token
client.login(token);
