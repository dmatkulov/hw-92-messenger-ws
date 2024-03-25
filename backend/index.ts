import mongoose from 'mongoose';
import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

import usersRouter from './routers/users';
import config from './config';
import User from './models/User';
import { ActiveConnections, IncomingMessage, OnlineUser } from './types';
import Message from './models/Message';

const app = express();

const port = 8000;
app.use(express.json());
app.use(cors());
app.use('/users', usersRouter);

expressWs(app);

const routerWS = express.Router();

const activeConnections: ActiveConnections = {};

const onlineUsers: OnlineUser[] = [];

routerWS.ws('/chat', (ws, _req) => {
  const id = crypto.randomUUID();
  activeConnections[id] = ws;

  let user: OnlineUser | null = null;

  ws.on('message', async (message) => {
    const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

    if (decodedMessage.type === 'LOGIN') {
      user = await User.findOne(
        { token: decodedMessage.payload },
        'displayName',
      );

      if (!user) return;

      onlineUsers.push(user);

      const messages = await Message.find()
        .sort({ createdAt: -1 })
        .limit(30)
        .populate('user', 'displayName');

      ws.send(
        JSON.stringify({
          type: 'LOGIN-SUCCESS',
          payload: {
            onlineUsers,
            messages,
          },
        }),
      );

      Object.keys(activeConnections).forEach((key) => {
        if (key !== id) {
          const connection = activeConnections[key];

          connection.send(
            JSON.stringify({
              type: 'NEW-USER',
              payload: { user },
            }),
          );
        }
      });
    }

    if (decodedMessage.type === 'LOGOUT') {
      delete activeConnections[id];

      const index = onlineUsers.findIndex(
        (onlineUser) => onlineUser._id === user?._id,
      );

      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }

      Object.keys(activeConnections).forEach((key) => {
        const connection = activeConnections[key];
        connection.send(
          JSON.stringify({
            type: 'USER-LOGOUT',
            payload: { onlineUsers },
          }),
        );
      });
    }

    if (decodedMessage.type === 'SEND-MESSAGE') {
      if (user) {
        const msg = new Message({
          user: user._id,
          message: decodedMessage.payload,
          createdAt: new Date(),
        });

        await msg.save();

        Object.keys(activeConnections).forEach((key) => {
          const connection = activeConnections[key];
          connection.send(
            JSON.stringify({
              type: 'NEW-MESSAGE',
              payload: {
                message: {
                  _id: msg._id,
                  user: user,
                  message: msg.message,
                  createdAt: msg.createdAt,
                },
              },
            }),
          );
        });
      }
    }

    ws.on('close', async () => {
      delete activeConnections[id];

      const ind = onlineUsers.findIndex((item) => item._id === user?._id);
      onlineUsers.splice(ind, 1);

      Object.keys(activeConnections).forEach((key) => {
        if (key !== id) {
          const connection = activeConnections[key];
          connection.send(
            JSON.stringify({
              type: 'USER-LOGOUT',
              payload: { onlineUsers },
            }),
          );
        }
      });
    });
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
