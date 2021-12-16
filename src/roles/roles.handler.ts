import { CacheType, Client, Interaction } from 'discord.js';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import {
  factionDolphinRoleId,
  factionGeneralsRoleId,
  factionWhaleClubRoleId,
  guildId,
  holdersRoleId,
} from '../utils/utils';
import { getAddress, getAssetsPerAddress, getListedItemsPerAddress } from '../utils/imxUtils';

const Web3 = require('web3');
let imx;

export const applyRoles = async (client: Client, imxClient: ImmutableXClient) => {
  imx = imxClient;

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (commandName === 'bf-verify') {
      await executeApplyRoles(client, interaction);
    }
  });
};

const applyRole = async (client: Client, interaction: Interaction<CacheType>, roleId: string) => {
  const guild = client.guilds.cache.get(guildId);
  const member = await guild?.members.fetch(interaction.user.id);
  const role = await guild?.roles.fetch(roleId);
  if (role) member?.roles.add(role);
};

const applyHoldersRole = async (
  assets: [],
  client: Client<boolean>,
  interaction: Interaction<CacheType>,
): Promise<number> => {
  // @HOLDERS -> 1+ NFT
  if (assets.length > 1) {
    await applyRole(client, interaction, holdersRoleId);
    return 1;
  }
  return 0;
};

const applyFactionDolphinRole = async (
  assets: [],
  client: Client<boolean>,
  interaction: Interaction<CacheType>,
): Promise<number> => {
  // @Faction Dolphin -> 5+ NFTs
  if (assets.length > 5) {
    await applyRole(client, interaction, factionDolphinRoleId);
    return 1;
  }
  return 0;
};

const applyFactionWhaleClubRole = async (
  assets: [],
  client: Client<boolean>,
  interaction: Interaction<CacheType>,
): Promise<number> => {
  // @Faction Whale Club -> 10+ NFTs
  if (assets.length > 10) {
    await applyRole(client, interaction, factionWhaleClubRoleId);
    return 1;
  }
  return 0;
};

const applyFactionGeneralsRole = async (
  assets: [],
  client: Client<boolean>,
  interaction: Interaction<CacheType>,
  address: string,
): Promise<number> => {
  // @Faction Generals -> At least 1 NFT unlisted and all the other NFTs must be > 0.1 eth
  const listedItems = await getListedItemsPerAddress(imx, address);
  if (assets.length >= 1) {
    const priceFloor = 0.15;
    const hasOneUnlisted = assets.length > listedItems.length;
    let isRestAboveLimit = listedItems.filter((listedItem) => listedItem.price > priceFloor).length > 0;

    if (hasOneUnlisted && isRestAboveLimit) {
      await applyRole(client, interaction, factionGeneralsRoleId);
      return 1;
    }
  }
  return 0;
};

const executeApplyRoles = async (client: Client, interaction: Interaction<CacheType>) => {
  const address = getAddress(interaction);
  if (Web3.utils.isAddress(address)) {
    try {
      const assets = await getAssetsPerAddress(imx, address);
      let numberOfRolesApplied = 0;

      // Rules
      numberOfRolesApplied += await applyHoldersRole(assets, client, interaction);
      numberOfRolesApplied += await applyFactionDolphinRole(assets, client, interaction);
      numberOfRolesApplied += await applyFactionWhaleClubRole(assets, client, interaction);
      numberOfRolesApplied += await applyFactionGeneralsRole(assets, client, interaction, address);

      let message = 'Your verification was successful, but no roles were applied!';
      if (numberOfRolesApplied === 1) message = 'Your verification was successful and you got 1 new role!';
      if (numberOfRolesApplied > 1)
        message = `Your verification was successful and you got ${numberOfRolesApplied} new roles!`;

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
