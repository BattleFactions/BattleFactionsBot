const prefix = '#';

export const getUpdateExpression = (item) => {
  const updateExpression = Object.keys(item).reduce((updateExpression, key) => {
    return [...updateExpression, `${prefix}${key} = :${key}`];
  }, []);

  return updateExpression.length > 0 ? `SET ${updateExpression.join(', ')}` : '';
};

export const getExpressionAttributeValues = (item) => {
  return Object.keys(item).reduce((result, key) => {
    return Object.assign(result, {
      [`:${key}`]: item[key.toString()],
    });
  }, {});
};

export const getExpressionAttributeNames = (item) => {
  return Object.keys(item).reduce((result, key) => {
    return Object.assign(result, {
      [`${prefix}${key}`]: key,
    });
  }, {});
};
