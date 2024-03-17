import { Router } from 'express';
import Message from '../models/Message';
import auth from '../middleware/auth';

const messagesRouter = Router();

messagesRouter.get('/', auth, async (_req, res, next) => {
  try {
    const message = await Message.find()
      .limit(30)
      .sort({ createdAt: 1 })
      .populate({
        path: 'user',
        select: 'displayName',
      });
    return res.send(message);
  } catch (e) {
    return next(e);
  }
});

export default messagesRouter;
