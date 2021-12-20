import { SlashCommandBuilder } from '@discordjs/builders';

export const bfLinkEthCommand = () => {
  return new SlashCommandBuilder()
    .setName('bf-link-eth')
    .setDescription('Link ETH wallets to a discord users profile.')
    .addStringOption((option) =>
      option.setName('eth-address').setDescription('The ETH address to link to the users profile').setRequired(true),
    );
};
