import { ImmutableOrderStatus } from '@imtbl/imx-sdk';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { User } from 'discord.js';
import { collection } from './utils';

// Public functions
export const getAddress = (interaction) => {
  const { options } = interaction;
  return options.getString('address');
};

export const getUser = (interaction): User => {
  return interaction.user;
};

export const isBot = (interaction) => {
  const { user } = interaction;
  return user?.bot;
};

export const getListOfAssetsAddresses = async (imxClient): Promise<Asset[]> => {
  const listOfAssets: Asset[] = [];
  let hasMoreItems = false;
  let cursor;
  do {
    const response = await imxClient.getAssets({ collection, cursor });
    const { result, remaining } = response;
    cursor = response.cursor;
    const assets = result.map((asset) => ({
      address: asset.user,
    })) as Asset[];
    listOfAssets.push(...assets);
    hasMoreItems = remaining === 1;
  } while (hasMoreItems);

  return listOfAssets;
};

export const getAssetsPerAddress = async (imxClient, address: string): Promise<[]> => {
  const { result: assets } = await imxClient.getAssets({
    collection,
    user: address,
  });
  return (
    assets?.map((asset) => ({
      id: asset.token_id,
    })) ?? []
  );
};

export const getOrdersPerAddress = async (imxClient, address: string): Promise<[]> => {
  const { result: orders } = await imxClient.getOrders({
    user: address,
    status: ImmutableOrderStatus.active,
    sell_token_address: collection,
  });
  return orders ?? [];
};

export const getListedItemsPerAddress = async (imxClient, address: string): Promise<ListedItems[]> => {
  const orders = await getOrdersPerAddress(imxClient, address);
  return (
    orders?.map(({ sell, buy }) => ({
      id: sell['data']['token_id'] as string,
      price: getPrice(buy['data']['decimals'], buy['data']['quantity']),
    })) || []
  );
};

// Types
export type ListedItems = {
  id: string;
  price: number;
};

export type Asset = {
  address: string;
};

// Private functions
const getPrice = (decimal: number, quantity: BigNumber) => {
  return Number(formatUnits(BigNumber.from(quantity), decimal));
};
