enum ErrorTypesEnum {
  WALLET_LIST_ERROR = 'WalletListError',
  WALLET_CREATE_ERROR = 'WalletCreateError',
  WALLET_READ_ERROR = 'WalletReadError',
  WALLET_UPDATE_ERROR = 'WalletUpdateError',
  WALLET_DELETE_ERROR = 'WalletDeleteError',
  WALLET_LINKED_ERROR = 'WalletLinkedError',
  LIST_USER_ID_ERROR = 'ListUserIdError',
  USER_CREATE_ERROR = 'UserCreateError',
  USER_READ_ERROR = 'UserReadError',
  USER_UPDATE_ERROR = 'UserUpdateError',
  USER_DELETE_ERROR = 'UserDeleteError',
  LINK_ETH_ERROR = 'LinkEthError',
  VERIFY_USER_ERROR = 'VerifyUserError',
}

export const walletListError: AppError = {
  type: ErrorTypesEnum.WALLET_LIST_ERROR,
  message: 'Could not list the wallets',
};

export const walletCreateError: AppError = {
  type: ErrorTypesEnum.WALLET_CREATE_ERROR,
  message: 'Could not create the wallet',
};

export const walletReadError: AppError = {
  type: ErrorTypesEnum.WALLET_READ_ERROR,
  message: 'Could not find the wallet',
};

export const walletUpdateError: AppError = {
  type: ErrorTypesEnum.WALLET_UPDATE_ERROR,
  message: 'Could not update the wallet',
};

export const walletDeleteError: AppError = {
  type: ErrorTypesEnum.WALLET_DELETE_ERROR,
  message: 'Could not delete the wallet',
};

export const walletLinkedError: AppError = {
  type: ErrorTypesEnum.WALLET_LINKED_ERROR,
  message: 'This wallet is already linked to another user. Any questions, talk to a moderator.',
};

export const listUsersIdsError: AppError = {
  type: ErrorTypesEnum.LIST_USER_ID_ERROR,
  message: 'Could not list the users ids',
};

export const userCreateError: AppError = {
  type: ErrorTypesEnum.USER_CREATE_ERROR,
  message: 'Could not create the user',
};

export const userReadError: AppError = {
  type: ErrorTypesEnum.USER_READ_ERROR,
  message: 'Could not find the user',
};

export const userUpdateError: AppError = {
  type: ErrorTypesEnum.USER_UPDATE_ERROR,
  message: 'Could not update the user',
};

export const userDeleteError: AppError = {
  type: ErrorTypesEnum.USER_DELETE_ERROR,
  message: 'Could not delete the user',
};

export const linkEthError: AppError = {
  type: ErrorTypesEnum.LINK_ETH_ERROR,
  message: 'Could not link the user to the wallet',
};

export const verifyUserError: AppError = {
  type: ErrorTypesEnum.VERIFY_USER_ERROR,
  message: 'Could not verify the user for this wallet',
};

export const isAppError = (error: Error | AppError): boolean => {
  if (!('type' in error)) {
    return false;
  }
  const errorTypes = Object.values<string>(ErrorTypesEnum);
  return errorTypes.includes(error.type);
};
