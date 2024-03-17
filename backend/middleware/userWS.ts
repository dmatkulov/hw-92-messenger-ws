import User from '../models/User';
import { LoggedUser } from '../types';

export const getUserAuth = async (token: string) => {
  const user = await User.findOne({ token });

  return {
    _id: user?._id,
    displayName: user?.displayName,
    token,
  } as LoggedUser;
};
