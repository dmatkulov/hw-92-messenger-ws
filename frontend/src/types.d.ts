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

export interface DecodedMessage {
  type: string;
  payload: {
    user: OnlineUser;
    onlineUsers: OnlineUser[];
    messages: Message[];
    message: Message;
  };
}

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
