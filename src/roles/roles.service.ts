import { Client, Interaction } from 'discord.js';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import {
  factionDolphinRoleId,
  factionGeneralsRoleId,
  factionWhaleClubRoleId,
  guildId,
  holdersRoleId,
} from '../utils/utils';
import { Asset, getAssetsPerAddress, getListedItemsPerAddress, ListedItems } from '../utils/imxUtils';
import { isAppError, verifyUserError } from '../errors/errors';
import { applyRole } from '../utils/discordUtils';

export const applyHoldersRole = async (assets: Asset[], client: Client, interaction: Interaction): Promise<number> => {
  // @HOLDERS -> 1+ NFT
  if (assets.length > 1) {
    await applyRole(interaction.user.id, holdersRoleId, client.guilds.cache.get(guildId));
    return 1;
  }
  return 0;
};

export const applyFactionDolphinRole = async (
  assets: Asset[],
  client: Client,
  interaction: Interaction,
): Promise<number> => {
  // @Faction Dolphin -> 5+ NFTs
  if (assets.length > 5) {
    await applyRole(interaction.user.id, factionDolphinRoleId, client.guilds.cache.get(guildId));
    return 1;
  }
  return 0;
};

export const applyFactionWhaleClubRole = async (
  assets: Asset[],
  client: Client,
  interaction: Interaction,
): Promise<number> => {
  // @Faction Whale Club -> 10+ NFTs
  if (assets.length > 10) {
    await applyRole(interaction.user.id, factionWhaleClubRoleId, client.guilds.cache.get(guildId));
    return 1;
  }
  return 0;
};

export const applyFactionGeneralsRole = async (
  assets: Asset[],
  client: Client,
  interaction: Interaction,
  listedItems: ListedItems[],
): Promise<number> => {
  // @Faction Generals -> All NFTs unlisted
  if (assets.length >= 1 && listedItems.length <= 0) {
    await applyRole(interaction.user.id, factionGeneralsRoleId, client.guilds.cache.get(guildId));
    return 1;
  }
  return 0;
};

export const applyRoles = async (
  client: Client,
  interaction: Interaction,
  imx: ImmutableXClient,
  addresses: string[],
): Promise<number> => {
  try {
    const assets: Asset[] = [];
    const listedItems: ListedItems[] = [];
    let numberOfRolesApplied = 0;

    for (const address of addresses) {
      const foundAssets = await getAssetsPerAddress(imx, address);
      assets.push(...foundAssets);
      const foundItems = await getListedItemsPerAddress(imx, address);
      listedItems.push(...foundItems);
    }

    numberOfRolesApplied += await applyHoldersRole(assets, client, interaction);
    numberOfRolesApplied += await applyFactionDolphinRole(assets, client, interaction);
    numberOfRolesApplied += await applyFactionWhaleClubRole(assets, client, interaction);
    numberOfRolesApplied += await applyFactionGeneralsRole(assets, client, interaction, listedItems);
    return numberOfRolesApplied;
  } catch (error) {
    if (isAppError(error)) throw error;
    throw verifyUserError;
  }
};
