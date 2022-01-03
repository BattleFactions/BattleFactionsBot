import { Client, Message, MessageAttachment } from 'discord.js';
import { getListOfAssetsAddresses } from '../utils/imxUtils';
import { message as messageResponse, prefix } from '../utils/utils';
import { hasModPermissions } from '../utils/discordUtils';

let imx;

type Asset = {
  address: string;
};

export const generateListOfHolders = async (client: Client, imxClient) => {
  imx = imxClient;

  client.on('messageCreate', async (message: Message) => {
    const { content: commandName, member } = message;

    if (commandName === `${prefix}${BattleFactions.CommandsEnum.BF_GENERATE_HOLDERS_LIST}`) {
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
    const listOfAssetsAddresses = await getListOfAssetsAddresses(imx);

    const listOfAddresses = listOfAssetsAddresses.reduce((address, asset: Asset) => {
      if (!Object.prototype.hasOwnProperty.call(address, asset.address)) {
        address[asset.address] = 0;
      }
      address[asset.address]++;
      return address;
    }, {});

    const listOfHolders = Object.keys(listOfAddresses).map((address) => {
      return { address: address, count: listOfAddresses[`${address}`] };
    });

    const attachment = new MessageAttachment(Buffer.from(JSON.stringify(listOfHolders)), 'listOfHolders.json');
    await message.reply(messageResponse('List of holders successfully generated.', [attachment]));
  } catch (e) {
    console.log('Error:', e);
    await message.reply(messageResponse('It was not possible to get the list of holders'));
  }
};
