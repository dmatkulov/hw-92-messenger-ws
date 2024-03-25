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

export interface IncomingMessage {
  type: string;
  payload: string;
}

export interface OnlineUser {
  _id: string;
  displayName: string;
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
