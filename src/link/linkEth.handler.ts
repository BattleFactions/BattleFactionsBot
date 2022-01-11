import { Client, Interaction } from 'discord.js';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { getAddress, getUser, isBot } from '../utils/imxUtils';
import { linkEth as linkEthService } from './linkEth.service';
import { isAppError } from '../errors/errors';
import { ephemeralMessage } from '../utils/utils';
const Web3 = require('web3');

export const linkEth = async (client: Client, imxClient: ImmutableXClient) => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (
      commandName === BattleFactions.CommandsEnum.BF_LINK_ETH ||
      commandName === BattleFactions.CommandsEnum.BF_VERIFY
    ) {
      await executeLinkEth(client, interaction, imxClient);
    }
  });
};

const executeLinkEth = async (client: Client, interaction: Interaction, imxClient: ImmutableXClient) => {
  const user = getUser(interaction);
  const address = getAddress(interaction);

  if (isBot(interaction)) {
    await interaction['reply'](ephemeralMessage('Bots cannot be used to link a wallet!'));
  }

  if (Web3.utils.isAddress(address)) {
    try {
      const linkResult = await linkEthService(client, interaction, imxClient, user, address);

      if (linkResult && linkResult.linked) {
        interaction['reply'](
          ephemeralMessage(
            `User ${user.username} and address ${address} were linked successfully. ${linkResult.numberOfRolesApplied} role(s) have been applied!`,
          ),
        );
      } else {
        interaction['reply'](
          ephemeralMessage(
            `User ${user.username} and address ${address} are already linked. ${linkResult.numberOfRolesApplied} role(s) have been applied!`,
          ),
        );
      }
    } catch (e) {
      console.log('Error:', e);
      if (isAppError(e)) {
        await interaction['reply'](ephemeralMessage(e.message));
      } else {
        await interaction['reply'](ephemeralMessage('Address not found'));
      }
    }
  } else {
    await interaction['reply'](ephemeralMessage('Invalid address!'));
  }
};
