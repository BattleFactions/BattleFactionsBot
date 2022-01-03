import { Client, Interaction } from 'discord.js';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { getAddress } from '../utils/imxUtils';
import { applyRoles as applyRolesService } from './roles.service';
const Web3 = require('web3');

export const applyRoles = async (client: Client, imxClient: ImmutableXClient) => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (commandName === 'bf-verify') {
      await execute(client, interaction, imxClient);
    }
  });
};

const execute = async (client: Client, interaction: Interaction, imx: ImmutableXClient) => {
  const address = getAddress(interaction);
  if (Web3.utils.isAddress(address)) {
    try {
      const numberOfRolesApplied = await applyRolesService(client, interaction, imx, address);
      let message = 'The verification was successful, but no roles were applied!';
      if (numberOfRolesApplied === 1) message = 'The verification was successful and 1 new role was applied!';
      if (numberOfRolesApplied > 1)
        message = `The verification was successful and ${numberOfRolesApplied} new roles were applied!`;

      interaction['reply']({
        content: message,
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
