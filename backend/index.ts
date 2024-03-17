import mongoose from 'mongoose';
import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

import usersRouter from './routers/users';
import config from './config';
import messagesRouter from './routers/messages';
import {
  ActiveConnections,
  IncomingMessage,
  LoggedUser,
  MessageWS,
} from './types';
import Message from './models/Message';
import User from './models/User';

const app = express();
expressWs(app);

const port = 8000;
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/chat', messagesRouter);

const routerWS = express.Router();

const activeConnections: ActiveConnections = {};
let loggedUsers: LoggedUser[] = [];
let userData: LoggedUser;

const getUserAuth = async (token: string) => {
  const user = await User.findOne({ token });

  if (user) {
    userData = {
      _id: user._id,
      displayName: user.displayName,
      token: user.token,
    };

    const existing = loggedUsers.find((user) => user.token === token);

    if (!existing) {
      loggedUsers.push(userData);
    }
  }
};
const sendOnlineUsers = (activeConnections: ActiveConnections) => {
  Object.values(activeConnections).forEach((connection) => {
    const outgoing = {
      type: 'ONLINE_USERS',
      payload: loggedUsers,
    };
    connection.send(JSON.stringify(outgoing));
  });
};
routerWS.ws('/messages', (ws, _req) => {
  const id = crypto.randomUUID();

  activeConnections[id] = ws;

  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;

    if (parsedMessage.type === 'LOGIN') {
      await getUserAuth(parsedMessage.payload);
      sendOnlineUsers(activeConnections);
    }

    if (parsedMessage.type === 'SEND_MESSAGE') {
      const newMessage = new Message({
        user: userData._id,
        message: parsedMessage.payload,
        createdAt: new Date(),
      });

      await newMessage.save();

      const messageData: MessageWS = {
        _id: newMessage._id,
        user: {
          _id: userData._id,
          displayName: userData.displayName,
        },
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      };

      Object.values(activeConnections).forEach((connection) => {
        const outgoing = {
          type: 'NEW_MESSAGE',
          payload: messageData,
        };

        connection.send(JSON.stringify(outgoing));
      });
    }
  });

  ws.on('close', () => {
    delete activeConnections[id];

    if (userData) {
      loggedUsers = loggedUsers.filter((user) => user._id !== userData._id);
      sendOnlineUsers(activeConnections);
    }
  });
});

app.use(routerWS);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log('Server online on port ' + port);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();
