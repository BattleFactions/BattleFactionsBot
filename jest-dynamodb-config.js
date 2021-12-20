module.exports = async () => {
  const bfTableProperties = {
    TableName: 'BattleFactions-tests',
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };

  return {
    tables: [bfTableProperties],
    port: 9000,
  };
};
