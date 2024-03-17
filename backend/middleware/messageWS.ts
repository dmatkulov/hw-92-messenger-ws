import { MessagePayload, MessageWS } from '../types';
import User from '../models/User';
import Message from '../models/Message';

export const getMessage = async (payload: MessagePayload) => {
  const user = await User.findOne({ token: payload.token });

  if (user) {
    const newMessage = new Message({
      user: user._id,
      message: payload.message,
      createdAt: new Date(),
    });

    await newMessage.save();

    return {
      _id: newMessage._id,
      user: {
        _id: user._id,
        displayName: user.displayName,
      },
      message: newMessage.message,
      createdAt: newMessage.createdAt,
    } as MessageWS;
  }
};
