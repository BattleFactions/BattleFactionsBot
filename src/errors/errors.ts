enum ErrorTypesEnum {
  USER_CREATE_ERROR = 'UserCreateError',
}

export const userCreateError: AppError = {
  type: ErrorTypesEnum.USER_CREATE_ERROR,
  message: 'Could not create the user',
};

export const isAppError = (error: Error | AppError): boolean => {
  if (!('type' in error)) {
    return false;
  }
  const errorTypes = Object.values<string>(ErrorTypesEnum);
  return errorTypes.includes(error.type);
};
