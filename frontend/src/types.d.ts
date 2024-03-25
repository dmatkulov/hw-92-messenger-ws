export interface User {
  _id: string;
  email: string;
  token: string;
  role: string;
  displayName: string;
}

export interface OnlineUser {
  _id: string;
  displayName: string;
}

export interface Message {
  _id: string;
  user: OnlineUser;
  message: string;
  createdAt: string;
}

export interface IncomingLoginMessage {
  type: 'LOGIN-SUCCESS';
  payload: {
    onlineUsers: OnlineUser[];
    messages: Message[];
  };
}

export interface IncomingLogoutMessage {
  type: 'USER-LOGOUT';
  payload: {
    onlineUsers: OnlineUser[];
  };
}

export interface IncomingNewUser {
  type: 'NEW-USER';
  payload: {
    user: OnlineUser;
  };
}

export interface IncomingNewMessage {
  type: 'NEW-MESSAGE';
  payload: {
    message: Message;
  };
}

export type DecodedMessage =
  | IncomingLoginMessage
  | IncomingLogoutMessage
  | IncomingNewMessage
  | IncomingNewUser;

export interface RegisterMutation {
  email: string;
  displayName: string;
  password: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

//errors & responses
export interface RegisterResponse {
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}
