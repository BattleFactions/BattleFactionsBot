import { SlashCommandBuilder } from '@discordjs/builders';

export const bfVerifyCommand = () => {
  return new SlashCommandBuilder()
    .setName('bf-verify')
    .setDescription('Verify and apply roles for users')
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('The user wallet address to be verified and linked to the user')
        .setRequired(true),
    );
};
