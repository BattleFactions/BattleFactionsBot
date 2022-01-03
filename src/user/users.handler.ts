import { Client, Message, MessageAttachment } from 'discord.js';
import { message as messageResponse, prefix } from '../utils/utils';
import { getListOfCurrentUsers, hasModPermissions } from '../utils/discordUtils';

export const generateListOfCurrentUsers = async (client: Client) => {
  client.on('messageCreate', async (message: Message) => {
    const { content: commandName, member } = message;

    if (commandName === `${prefix}${BattleFactions.CommandsEnum.BF_GENERATE_USERS_LIST}`) {
      const hasPermissions = await hasModPermissions(member);
      if (hasPermissions) {
        await execute(client, message);
      } else {
        await message.reply(messageResponse('You do not have enough permissions.'));
      }
    }
  });
};

const execute = async (client: Client, message: Message) => {
  try {
    const listOfUsers = await getListOfCurrentUsers(client);

    let csvData = '#,Id,Username,Discriminator,Username#Discriminator\n';

    listOfUsers.forEach((user, index) => {
      csvData += `${index + 1},${user.id},${user.username},${user.discriminator},${user.username}#${
        user.discriminator
      }\n`;
    });

    const attachment = new MessageAttachment(Buffer.from(csvData), 'ListOfUsers.csv');
    await message.reply(messageResponse('List of users successfully generated.', [attachment]));
  } catch (e) {
    console.log('Error:', e);
    await message.reply(messageResponse('It was not possible to get the list of current users'));
  }
};
