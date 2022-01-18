import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  walletCreateError,
  walletDeleteError,
  walletListError,
  walletReadError,
  walletUpdateError,
} from '../errors/errors';
import { createEntity, deleteEntity, listEntities, readEntity, updateEntity } from '../utils/serviceUtils';

dayjs.extend(utc);

const listWallets = async (userId: BattleFactions.Id): Promise<BattleFactions.WalletEntity[]> => {
  const GSI1PK = 'WALLET';
  const GSI1SK = `USER_ID#${userId}`;
  const keyConditionExpression = 'GSI1PK = :GSI1PK AND begins_with(GSI1SK, :GSI1SK)';
  return listEntities(GSI1PK, GSI1SK, keyConditionExpression, walletListError, 'GSI1');
};

const createWallet = async (wallet: BattleFactions.WalletEntity): Promise<BattleFactions.WalletEntity> => {
  return createEntity(wallet, walletCreateError);
};

const readWallet = async (walletId: BattleFactions.Address): Promise<BattleFactions.WalletEntity> => {
  const PK = `WALLET`;
  const SK = `WALLET_ID#${walletId}`;
  return readEntity(PK, SK, walletReadError);
};

const updateWallet = async (wallet: BattleFactions.WalletEntity): Promise<BattleFactions.Id> => {
  const PK = `WALLET`;
  const SK = `WALLET_ID#${wallet.Id}`;
  wallet.UpdatedAt = dayjs.utc().toISOString();
  return updateEntity(PK, SK, wallet, ['Address', 'Network', 'UpdatedAt'], walletUpdateError);
};

const deleteWallet = async (walletId: BattleFactions.Address): Promise<boolean> => {
  const PK = `WALLET`;
  const SK = `WALLET_ID#${walletId}`;
  return deleteEntity(PK, SK, walletDeleteError);
};

export { listWallets, createWallet, readWallet, updateWallet, deleteWallet };
