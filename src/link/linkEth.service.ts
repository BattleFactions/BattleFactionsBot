import { Client, Interaction, User } from 'discord.js';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { isAppError, linkEthError, walletLinkedError } from '../errors/errors';
import { createUser, readUser } from '../user/user.service';
import { userMapper } from '../user/user.mapper';
import { applyRoles } from '../roles/roles.service';
import { createWallet, listWallets, readWallet } from '../wallets/wallet.service';
import { buildWalletEntity } from '../wallets/wallet.mapper';

const createUserToBeLinked = async (user: User): Promise<BattleFactions.UserEntity> => {
  const userEntity = userMapper(user);
  await createUser(userEntity);
  return readUser(userEntity.Id);
};

type LinkResult = {
  linked: boolean;
  numberOfRolesApplied: number;
};

const linkEth = async (
  client: Client,
  interaction: Interaction,
  imxClient: ImmutableXClient,
  user: User,
  address: BattleFactions.Address,
): Promise<LinkResult> => {
  try {
    // Get wallet and create it if it doesn't exist
    let walletEntity = await readWallet(address);
    if (!walletEntity) {
      walletEntity = await createWallet(buildWalletEntity(address, user.id));
    }
    if (walletEntity.UserId !== user.id) throw walletLinkedError;

    // Get user and create it if it doesn't exist
    let userEntity = await readUser(user.id);
    if (!userEntity) {
      userEntity = await createUserToBeLinked(user);
    }

    const wallets = await listWallets(userEntity.Id);
    const addresses = wallets.map((wallet) => wallet.Address);

    const numberOfRolesApplied = await applyRoles(client, interaction.user.id, imxClient, addresses);
    return Promise.resolve({ linked: true, numberOfRolesApplied });
  } catch (error) {
    if (isAppError(error)) throw error;
    throw linkEthError;
  }
};

export { linkEth };
