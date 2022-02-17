import { Client } from 'discord.js';
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

export const applyHoldersRole = async (assets: Asset[], client: Client, userId: BattleFactions.Id): Promise<number> => {
  // @HOLDERS -> 1+ NFT
  if (assets.length > 1) {
    await applyRole(userId, holdersRoleId, client.guilds.cache.get(guildId));
    return 1;
  }
  return 0;
};

export const applyFactionDolphinRole = async (
  assets: Asset[],
  client: Client,
  userId: BattleFactions.Id,
): Promise<number> => {
  // @Faction Dolphin -> 5+ NFTs
  if (assets.length > 5) {
    await applyRole(userId, factionDolphinRoleId, client.guilds.cache.get(guildId));
    return 1;
  }
  return 0;
};

export const applyFactionWhaleClubRole = async (
  assets: Asset[],
  client: Client,
  userId: BattleFactions.Id,
): Promise<number> => {
  // @Faction Whale Club -> 10+ NFTs
  if (assets.length > 10) {
    await applyRole(userId, factionWhaleClubRoleId, client.guilds.cache.get(guildId));
    return 1;
  }
  return 0;
};

export const applyFactionGeneralsRole = async (
  assets: Asset[],
  client: Client,
  userId: BattleFactions.Id,
  listedItems: ListedItems[],
): Promise<number> => {
  // @Faction Generals -> All NFTs unlisted
  if (assets.length >= 1 && listedItems.length <= 0) {
    await applyRole(userId, factionGeneralsRoleId, client.guilds.cache.get(guildId));
    return 1;
  }
  return 0;
};

export const applyRoles = async (
  client: Client,
  userId: BattleFactions.Id,
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

    numberOfRolesApplied += await applyHoldersRole(assets, client, userId);
    numberOfRolesApplied += await applyFactionDolphinRole(assets, client, userId);
    numberOfRolesApplied += await applyFactionWhaleClubRole(assets, client, userId);
    numberOfRolesApplied += await applyFactionGeneralsRole(assets, client, userId, listedItems);
    return numberOfRolesApplied;
  } catch (error) {
    if (isAppError(error)) throw error;
    throw verifyUserError;
  }
};
