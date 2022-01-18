type Headers = Record<string, string>;
type Message = Record<string, unknown> | Object[] | string | null | undefined;

interface HandlerResponse {
  statusCode: import('http-status-codes').StatusCodes;
  headers: Headers;
  body: string;
}

interface HandlerEvent<PathParameters = {}, QueryStringParameters = {}> {
  pathParameters: PathParameters;
  queryStringParameters: QueryStringParameters;
  headers: Headers;
  body?: string;
}

type AwsHandler<PathParameters = {}, QueryStringParameters = {}> = import('aws-lambda').Handler<
  HandlerEvent<PathParameters, QueryStringParameters>,
  HandlerResponse | void
>;

type Handler<PathParameters = Record<string, string>, QueryStringParameters = Record<string, string>> = AwsHandler<
  PathParameters,
  QueryStringParameters
>;

interface AppError {
  type: string;
  message: string;
}

interface HttpError {
  statusCode: import('http-status-codes').StatusCodes;
  message: string;
}

declare namespace BattleFactions {
  type Id = string;
  type Name = string;
  type Email = string;
  type Phone = string;
  type Country = string;
  type DateInISOString = string; // Format: 2021-09-29
  type Username = string;
  type Discriminator = string;
  type Avatar = string | null;
  type Address = string;

  const enum CommandsEnum {
    BF_VERIFY = 'bf-verify',
    BF_LINK_ETH = 'bf-link-eth',
    BF_GENERATE_HOLDERS_LIST = 'bf-generate-holders-list',
    BF_GENERATE_USERS_LIST = 'bf-generate-users-list',
  }

  const enum NetworkTypesEnum {
    ETH = 'ETH',
  }
  type NetworkTypes = keyof typeof NetworkTypesEnum;

  const enum TypesEnum {
    User = 'User',
    Wallet = 'Wallet',
  }
  type EntityTypes = keyof typeof TypesEnum;
  type ModelTypes = keyof typeof TypesEnum;

  interface BaseEntity<EntityType extends EntityTypes, PKType, SKType> {
    PK: PKType;
    SK: SKType;
    Id: Id;
    Entity: EntityType;
    CreatedAt: DateAndTimeInISOString;
    UpdatedAt?: DateAndTimeInISOString;
  }

  interface BaseModel<ModelType extends ModelTypes> {
    Id: Id;
    CreatedAt: DateAndTimeInISOString;
    UpdatedAt?: DateAndTimeInISOString;
  }

  interface UserEntity extends BaseEntity<TypesEnum.User, 'USER', `USER_ID#${Id}`> {
    Username: Username;
    Discriminator: Discriminator;
    Avatar?: Avatar;
    Name?: Name;
    Email?: Email;
    Phone?: Phone;
    Country?: Country;
    DateOfBirth?: DateInISOString;
  }

  interface WalletEntity extends BaseEntity<TypesEnum.Wallet, `WALLET`, `WALLET_ID#${Id}`> {
    GSI1PK: 'WALLET';
    GSI1SK: `USER_ID#${Id}#WALLET_ID#${Id}`;
    UserId: Id;
    Address: Address;
    Network: NetworkTypes;
  }

  type Entity = UserEntity | WalletEntity;

  interface WalletModel extends BaseModel<TypesEnum.Wallet> {
    UserId: Id;
    Address: Address;
    Network: NetworkTypes;
  }

  // interface UserDto extends BaseDto<TypesEnum.User> {
  //   Username: Username;
  //   Discriminator: Discriminator;
  //   Avatar?: Avatar;
  //   Name?: Name;
  //   Email?: Email;
  //   Phone?: Phone;
  //   Country?: Country;
  //   DateOfBirth?: DateInISOString;
  // }

  // type Dto = UserDto | WalletDto;
}
