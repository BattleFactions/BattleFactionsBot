import { isAppError, linkEthError } from '../errors/errors';
import { Client, Interaction, User } from 'discord.js';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { createUser, getUser, updateUser } from '../user/user.service';
import { hasWallet } from '../utils/utils';
import { userMapper } from '../user/user.mapper';
import { applyRoles } from '../roles/roles.service';

const createUserLink = async (user: User, address: string) => {
  const userEntity = userMapper(user, {
    address,
    network: BattleFactions.NetworkTypesEnum.ETH,
  });
  await createUser(userEntity);
  return true;
};

const updateUserLink = async (userEntity: BattleFactions.UserEntity, address: string): Promise<boolean> => {
  if (!hasWallet(userEntity.Wallets, address)) {
    userEntity.Wallets.push({
      address,
      network: BattleFactions.NetworkTypesEnum.ETH,
    });
    await updateUser(userEntity);
    return true;
  }
  return false;
};

const linkEth = async (
  client: Client,
  interaction: Interaction,
  imxClient: ImmutableXClient,
  user: User,
  address: BattleFactions.Address,
): Promise<boolean> => {
  try {
    let linked: boolean;
    let userEntity = await getUser(user.id);
    const addresses = [address];
    if (userEntity) {
      const userAddresses = userEntity.Wallets.map((wallet) => {
        return wallet.address;
      });
      addresses.push(...userAddresses);
      linked = await updateUserLink(userEntity, address);
    } else {
      linked = await createUserLink(user, address);
    }
    //TODO Apply roles based on eth addresses
    await applyRoles(client, interaction, imxClient, addresses);
    return Promise.resolve(linked);
  } catch (error) {
    if (isAppError(error)) throw error;
    throw linkEthError;
  }
};

export { linkEth };
