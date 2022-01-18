import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import NetworkTypesEnum = BattleFactions.NetworkTypesEnum;

dayjs.extend(utc);

export const buildWalletEntity = (
  address: BattleFactions.Address,
  userId: BattleFactions.Id,
): BattleFactions.WalletEntity => {
  return walletModelToEntity({
    Id: address,
    Address: address,
    UserId: userId,
    Network: NetworkTypesEnum.ETH,
    CreatedAt: dayjs(new Date()).toISOString(),
  });
};

export const walletModelToEntity = (wallet: BattleFactions.WalletModel): BattleFactions.WalletEntity => {
  return {
    Entity: BattleFactions.TypesEnum.Wallet,
    PK: 'WALLET',
    SK: `WALLET_ID#${wallet.Id}`,
    Id: wallet.Id,
    GSI1PK: 'WALLET',
    GSI1SK: `USER_ID#${wallet.UserId}#WALLET_ID#${wallet.Id}`,
    UserId: wallet.UserId,
    Address: wallet.Address,
    Network: wallet.Network,
    CreatedAt: dayjs(wallet.CreatedAt).toISOString(),
  };
};
