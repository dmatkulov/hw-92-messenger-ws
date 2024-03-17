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
      displayName: 'Richard',
      password: '123',
      token: randomUUID(),
      role: 'user',
    },
    {
      email: 'user2',
      displayName: 'Jessica',
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
      message: 'Good morning, everyone!',
    },
    {
      user: user2,
      message: 'How was your day?',
    },
    {
      user: user2,
      message: 'Just finished reading a fascinating book.',
    },
    {
      user: user3,
      message: "Let's meet for lunch tomorrow.",
    },
    {
      user: user3,
      message: "The weather is lovely today, isn't it?",
    },
  );

  await db.close();
};

void run();
