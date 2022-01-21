import { getListOfAssetsAddresses } from '../utils/imxUtils';

type Asset = {
  address: string;
};

type Holder = {
  address: BattleFactions.Address;
  count: number;
};

const getListOfHolders = async (imx): Promise<Holder[]> => {
  const listOfAssetsAddresses = await getListOfAssetsAddresses(imx);

  const listOfAddresses = listOfAssetsAddresses.reduce((address, asset: Asset) => {
    if (!Object.prototype.hasOwnProperty.call(address, asset.address)) {
      address[asset.address] = 0;
    }
    address[asset.address]++;
    return address;
  }, {});

  return Object.keys(listOfAddresses).map((address) => {
    return { address: address, count: listOfAddresses[`${address}`] };
  });
};

export { getListOfHolders };
