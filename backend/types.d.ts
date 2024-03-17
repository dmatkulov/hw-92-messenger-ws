import mongoose, { Model } from 'mongoose';
import { WebSocket } from 'ws';

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface MessageFields {
  user: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
}

export interface MessageWS {
  _id: mongoose.Types.ObjectId;
  user: {
    _id: mongoose.Types.ObjectId;
    displayName: string;
  };
  message: string;
  createdAt: Date;
}

export interface IncomingChatMessage {
  type: 'SEND_MESSAGE';
  payload: string;
}

export interface IncomingLoginMessage {
  type: 'LOGIN';
  payload: string;
}

export type IncomingMessage = IncomingChatMessage | IncomingLoginMessage;

export interface LoggedUser {
  _id: mongoose.Types.ObjectId;
  displayName: string;
  token: string;
}

export interface UserFields {
  email: string;
  displayName: string;
  password: string;
  token: string;
  role: string;
}

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;

  generateToken(): void;
}

type UserModel = Model<UserFields, unknown, UserMethods>;
