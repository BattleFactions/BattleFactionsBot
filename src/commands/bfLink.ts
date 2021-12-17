import { SlashCommandBuilder } from '@discordjs/builders';

export const bfLinkCommand = () => {
  return new SlashCommandBuilder()
    .setName('bf-link')
    .setDescription('Link users and wallets')
    .addStringOption((option) =>
      option.setName('address').setDescription('The wallet address to link to the users profile').setRequired(true),
    );
};
