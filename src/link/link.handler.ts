import { CacheType, Client, Interaction } from 'discord.js';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import {getAddress, getUser, isBot} from '../utils/imxUtils';

const Web3 = require('web3');
let imx;

export const link = async (client: Client, imxClient: ImmutableXClient) => {
  imx = imxClient;

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (commandName === 'bf-link') {
      await executeLink(client, interaction);
    }
  });
};

const executeLink = async (client: Client, interaction: Interaction<CacheType>) => {
  const user = getUser(interaction);
  const address = getAddress(interaction);

  if (isBot(interaction)) {
    await interaction['reply']({
      content: 'Bots cannot be used to link a wallet!',
      ephemeral: true,
    });
  }

  if (Web3.utils.isAddress(address)) {
    try {
      interaction['reply']({
        content: 'testing',
        ephemeral: true,
      });
    } catch (e) {
      console.log('Error:', e);
      await interaction['reply']({
        content: 'Address not found',
        ephemeral: true,
      });
    }
  } else {
    await interaction['reply']({
      content: 'Invalid address!',
      ephemeral: true,
    });
  }
};
