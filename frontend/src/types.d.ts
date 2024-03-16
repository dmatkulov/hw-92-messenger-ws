export interface User {
  _id: string;
  email: string;
  token: string;
  role: string;
  displayName: string;
}

export interface LoggedUser {
  _id: string;
  displayName: string;
  token: string;
}

export interface ChatMessage {
  user: string;
  message: string;
}

export interface ApiMessage {
  _id: string;
  user: string;
  message: string;
}

export interface IncomingChatMessage {
  type: 'NEW_MESSAGE';
  payload: ChatMessage;
}

export interface IncomingLoginMessage {
  type: 'ONLINE_USERS';
  payload: LoggedUser;
}

export interface IncomingWelcomeMessage {
  type: 'WELCOME';
  payload: string;
}

export type IncomingMessage =
  | IncomingChatMessage
  | IncomingLoginMessage
  | IncomingWelcomeMessage;

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
