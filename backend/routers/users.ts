import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const usersRouter = Router();

usersRouter.get('/', async (_req, res, next) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (e) {
    next(e);
  }
});

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
    });

    user.generateToken();
    await user.save();

    return res.send({ user });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }

    next(e);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(422).send({ error: 'Invalid credentials' });
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(422).send({ error: 'Email and password do not match' });
    }

    user.generateToken();
    await user.save();

    return res.send({ user });
  } catch (e) {
    next(e);
  }
});

usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const headerValue = req.get('Authorization');
    const successMessage = { message: 'Success' };

    if (!headerValue) {
      return res.send(successMessage);
    }

    const [_bearer, token] = headerValue.split(' ');

    if (!token) {
      return res.send(successMessage);
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.send(successMessage);
    }

    user.generateToken();
    await user.save();

    return res.send(successMessage);
  } catch (e) {
    return next(e);
  }
});

export default usersRouter;
