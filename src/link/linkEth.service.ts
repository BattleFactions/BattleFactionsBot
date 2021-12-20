import { userCreateError } from '../errors/errors';

const linkEth = async (user: BattleFactions.User) => {
  console.log('User:', user);
  // TODO Create or Update user here and apply roles based on eth address


  try {
  } catch (error) {
    throw userCreateError;
  }
};

export { linkEth };
