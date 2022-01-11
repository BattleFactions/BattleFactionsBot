enum ErrorTypesEnum {
  USER_CREATE_ERROR = 'UserCreateError',
  USER_UPDATE_ERROR = 'UserUpdateError',
  USER_READ_ERROR = 'UserReadError',
  LINK_ETH_ERROR = 'LinkEthError',
  VERIFY_USER_ERROR = 'VerifyUserError',
}

export const userCreateError: AppError = {
  type: ErrorTypesEnum.USER_CREATE_ERROR,
  message: 'Could not create the user',
};

export const userUpdateError: AppError = {
  type: ErrorTypesEnum.USER_UPDATE_ERROR,
  message: 'Could not update the user',
};

export const userReadError: AppError = {
  type: ErrorTypesEnum.USER_READ_ERROR,
  message: 'Could not find the user',
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
