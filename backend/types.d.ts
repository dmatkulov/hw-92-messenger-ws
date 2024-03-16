import mongoose, { Model } from 'mongoose';
import { WebSocket } from 'ws';

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface MessageFields {
  user: mongoose.Types.ObjectId;
  message: string;
}

export interface IncomingMessage {
  type: string;
  payload: MessageFields;
}

export interface UserFields {
  email: string;
  displayName: string;
  password: string;
  token: string;
  role: string;
  googleID?: string;
}

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;

  generateToken(): void;
}

type UserModel = Model<UserFields, unknown, UserMethods>;
