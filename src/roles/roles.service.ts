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

export const applyRole = async (client: Client, interaction: Interaction, roleId: string) => {
  const guild = client.guilds.cache.get(guildId);
  const member = await guild?.members.fetch(interaction.user.id);
  const role = await guild?.roles.fetch(roleId);
  if (role) member?.roles.add(role);
};

export const applyHoldersRole = async (assets: Asset[], client: Client, interaction: Interaction): Promise<number> => {
  // @HOLDERS -> 1+ NFT
  if (assets.length > 1) {
    await applyRole(client, interaction, holdersRoleId);
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
    await applyRole(client, interaction, factionDolphinRoleId);
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
    await applyRole(client, interaction, factionWhaleClubRoleId);
    return 1;
  }
  return 0;
};

export const applyFactionGeneralsRole = async (
  assets: Asset[],
  client: Client,
  interaction: Interaction,
  imx: ImmutableXClient,
  listedItems: ListedItems[],
): Promise<number> => {
  // @Faction Generals -> At least 1 NFT unlisted and all the other NFTs must be > 0.1 eth
  // Rule => 1-2 = 1 unlisted
  if (assets.length <= 2 && assets.length - listedItems.length >= 1) {
    await applyRole(client, interaction, factionGeneralsRoleId);
    return 1;
  }
  // Rule => 3-5 = 2 unlisted
  if (assets.length <= 5 && assets.length - listedItems.length >= 2) {
    await applyRole(client, interaction, factionGeneralsRoleId);
    return 1;
  }
  // Rule => 6+ = 3 unlisted
  if (assets.length >= 6 && assets.length - listedItems.length >= 3) {
    await applyRole(client, interaction, factionGeneralsRoleId);
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
    numberOfRolesApplied += await applyFactionGeneralsRole(assets, client, interaction, imx, listedItems);
    return numberOfRolesApplied;
  } catch (error) {
    if (isAppError(error)) throw error;
    throw verifyUserError;
  }
};
