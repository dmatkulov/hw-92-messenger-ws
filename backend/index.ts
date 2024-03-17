import mongoose from 'mongoose';
import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

import usersRouter from './routers/users';
import config from './config';
import messagesRouter from './routers/messages';
import { ActiveConnections, IncomingMessage } from './types';
import Message from './models/Message';

const app = express();
expressWs(app);

const port = 8000;
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/chat', messagesRouter);

const routerWS = express.Router();
const activeConnections: ActiveConnections = {};

routerWS.ws('/messages', (ws, _req) => {
  const id = crypto.randomUUID();

  activeConnections[id] = ws;

  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;

    if (parsedMessage.type === 'SEND_MESSAGE') {
      const newMessage = new Message(parsedMessage.payload);
      void newMessage.save();

      Object.values(activeConnections).forEach((connection) => {
        const outgoing = {
          type: 'NEW_MESSAGE',
          payload: newMessage,
        };

        connection.send(JSON.stringify(outgoing));
      });
    }
  });

  ws.on('close', () => {
    delete activeConnections[id];
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
