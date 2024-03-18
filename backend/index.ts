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
  LoggedInUser,
  OnlineUser,
} from './types';
import { getMessage } from './middleware/messageWS';
import { getUserAuth } from './middleware/userWS';
import { sendNewMessage, sendOnlineUsers } from './utils';

const app = express();
expressWs(app);

const port = 8000;
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/chat', messagesRouter);

const routerWS = express.Router();

const activeConnections: ActiveConnections = {};

const loggedInUsers: LoggedInUser = {};
let onlineUsers: OnlineUser[] = [];
let userData: OnlineUser;

routerWS.ws('/messages', (ws, _req) => {
  const id = crypto.randomUUID();

  activeConnections[id] = ws;

  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;

    if (parsedMessage.type === 'LOGIN') {
      userData = await getUserAuth(parsedMessage.payload);

      if (userData) {
        loggedInUsers[id] = userData;
        const existing = onlineUsers.find(
          (user) => user.token === userData.token,
        );

        if (!existing) {
          onlineUsers.push(userData);
        }

        if (onlineUsers.length > 0) {
          sendOnlineUsers(activeConnections, onlineUsers);
        }
      }
    }

    if (parsedMessage.type === 'SEND_MESSAGE') {
      const messageData = await getMessage(parsedMessage.payload);
      if (messageData) {
        sendNewMessage(activeConnections, messageData);
      }
    }
  });

  ws.on('close', () => {
    delete activeConnections[id];

    const loggedOutUser = loggedInUsers[id];
    if (loggedOutUser) {
      onlineUsers = onlineUsers.filter(
        (user) => user._id !== loggedOutUser._id,
      );
      sendOnlineUsers(activeConnections, onlineUsers);
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
