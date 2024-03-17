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
import { getMessage } from './middleware/messageWS';
import { getUserAuth } from './middleware/userWS';

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

const sendNewMessage = (
  activeConnections: ActiveConnections,
  message: MessageWS,
) => {
  Object.values(activeConnections).forEach((connection) => {
    const outgoing = {
      type: 'NEW_MESSAGE',
      payload: message,
    };

    connection.send(JSON.stringify(outgoing));
  });
};

const sendOnlineUsers = (
  activeConnections: ActiveConnections,
  loggedUsers: LoggedUser[],
) => {
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
      userData = await getUserAuth(parsedMessage.payload);

      if (userData) {
        const existing = loggedUsers.find(
          (user) => user.token === userData.token,
        );

        if (!existing) {
          loggedUsers.push(userData);
        }

        if (loggedUsers.length > 0) {
          sendOnlineUsers(activeConnections, loggedUsers);
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

    if (userData) {
      loggedUsers = loggedUsers.filter((user) => user._id !== userData._id);
      if (loggedUsers.length > 0) {
        sendOnlineUsers(activeConnections, loggedUsers);
      }
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
