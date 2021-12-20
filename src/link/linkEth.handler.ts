import { CacheType, Client, Interaction } from 'discord.js';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { getAddress, getUser, isBot } from '../utils/imxUtils';
import { linkEth as linkEthService } from './linkEth.service';
import { isAppError } from '../errors/errors';
import { ephemeralMessage } from '../utils/utils';

const Web3 = require('web3');
let imx;

export const linkEth = async (client: Client, imxClient: ImmutableXClient) => {
  imx = imxClient;

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (commandName === BattleFactions.CommandsEnum.BF_LINK_ETH) {
      await executeLinkEth(client, interaction);
    }
  });
};

const executeLinkEth = async (client: Client, interaction: Interaction<CacheType>) => {
  const user = getUser(interaction);
  const address = getAddress(interaction);

  if (isBot(interaction)) {
    await interaction['reply'](ephemeralMessage('Bots cannot be used to link a wallet!'));
  }

  if (Web3.utils.isAddress(address)) {
    try {
      await linkEthService(user);

      interaction['reply'](
        ephemeralMessage(`User ${user.Username} and address ${address} were linked successfully!!!`),
      );
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
