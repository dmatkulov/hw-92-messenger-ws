import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import User from './models/User';
import config from './config';
import Message from './models/Message';

const dropCollection = async (
  db: mongoose.Connection,
  collectionName: string,
) => {
  try {
    await db.dropCollection(collectionName);
  } catch (e) {
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  const models = [User, Message];

  for (const model of models) {
    await dropCollection(db, model.collection.collectionName);
  }

  const [user1, user2, user3] = await User.create(
    {
      email: 'user1',
      displayName: 'user1',
      password: '123',
      token: randomUUID(),
      role: 'user',
    },
    {
      email: 'user2',
      displayName: 'user2',
      password: '123',
      token: randomUUID(),
      role: 'user',
    },
    {
      email: 'admin',
      displayName: 'admin',
      password: '123',
      token: randomUUID(),
      role: 'admin',
    },
  );

  await Message.create(
    {
      user: user1,
      message: 'message 1',
    },
    {
      user: user2,
      message: 'message 2',
    },
    {
      user: user3,
      message: 'message 3',
    },
  );

  await db.close();
};

void run();
