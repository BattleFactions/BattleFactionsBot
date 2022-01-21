import { Client, Message, MessageAttachment } from 'discord.js';
import { message as messageResponse, prefix } from '../utils/utils';
import { hasModPermissions } from 'app/utils/discordUtils';
import { getListOfHolders } from 'app/holders/holders.service';
import { getListedItemsPerAddress } from 'app/utils/imxUtils';

let imx;

export const getWalletsStatuses = async (client: Client, imxClient) => {
  imx = imxClient;

  client.on('messageCreate', async (message: Message) => {
    const { content: commandName, member } = message;

    if (commandName === `${prefix}${BattleFactions.CommandsEnum.BF_GENERATE_WALLETS_STATUSES}`) {
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
    const listOfHolders = await getListOfHolders(imx);

    // Generate the csv report
    let csvData = '#,Wallet Address,# of BFs,# of listed BFs\n';

    for (let i = 0; i < listOfHolders.length; i++) {
      const listedItems = await getListedItemsPerAddress(imx, listOfHolders[i].address);
      csvData += `${i + 1},${listOfHolders[i].address},${listOfHolders[i].count},${listedItems.length || ''}\n`;
    }

    const attachment = new MessageAttachment(Buffer.from(csvData), 'WalletsStatuses.csv');
    await message.reply(messageResponse('Wallets statuses successfully generated.', [attachment]));
  } catch (e) {
    console.log('Error:', e);
    await message.reply(messageResponse('It was not possible to generate the wallets statuses'));
  }
};
