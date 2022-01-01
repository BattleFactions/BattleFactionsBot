import { MessageAttachment } from 'discord.js';

require('dotenv').config();

export const prefix = '%';
export const linkAddress = 'https://link.x.immutable.com';
export const apiAddress = 'https://api.x.immutable.com/v1';
export const collection = '0xb941a7373e1dd60ad75e3460f849f28dd4bd6a07';
export const token = process.env.TOKEN ?? '';
export const clientId = process.env.CLIENT_ID ?? '';
export const guildId = process.env.GUILD_ID ?? '';
export const headquartersRoleId = process.env.HEADQUARTERS_ROLE_ID ?? '';
export const modRoleId = process.env.MOD_ROLE_ID ?? '';
export const holdersRoleId = process.env.HOLDERS_ROLE_ID ?? '';
export const factionDolphinRoleId = process.env.FACTION_DOLPHIN_ROLE_ID ?? '';
export const factionWhaleClubRoleId = process.env.FACTION_WHALE_CLUB_ROLE_ID ?? '';
export const factionGeneralsRoleId = process.env.FACTION_GENERALS_ROLE_ID ?? '';

export const ephemeralMessage = (message: string, files?: MessageAttachment[]) => ({
  content: message,
  ephemeral: true,
  files,
});

export const message = (message: string, files?: MessageAttachment[]) => ({
  content: message,
  ephemeral: false,
  files,
});

export const hasWallet = (wallets: BattleFactions.Wallet[], address: BattleFactions.Address) => {
  return wallets.findIndex((wallet) => wallet.address === address) != -1;
};
