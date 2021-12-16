import { Client, Message, MessageAttachment } from 'discord.js';
import { getListOfAssetsAddresses } from '../utils/imxUtils';
import { prefix } from '../utils/utils';

let imx;

type Asset = {
  address: string;
};

export const generateListOfHolders = async (client: Client, imxClient) => {
  imx = imxClient;

  client.on('messageCreate', async (message: Message) => {
    const { content: commandName } = message;
    if (commandName === `${prefix}bf-generate-holders-list`) {
      await execute(client, message);
    }
  });
};

const execute = async (client: Client, message: Message) => {
  try {
    const listOfAssetsAddresses = await getListOfAssetsAddresses(imx);

    const listOfAddresses = listOfAssetsAddresses.reduce((address, asset: Asset) => {
      if (!address.hasOwnProperty(asset.address)) {
        address[asset.address] = 0;
      }
      address[asset.address]++;
      return address;
    }, {});

    const listOfHolders = Object.keys(listOfAddresses).map((address) => {
      return { address: address, count: listOfAddresses[address] };
    });

    const attachment = new MessageAttachment(Buffer.from(JSON.stringify(listOfHolders)), 'listOfHolders.json');
    await message.reply({
      content: 'List of holders successfully generated.',
      files: [attachment],
    });
  } catch (e) {
    console.log('Error:', e);
    await message.reply({
      content: 'It was not possible to get the list of holders',
    });
  }
};
