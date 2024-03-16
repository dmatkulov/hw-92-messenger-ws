import { Router } from 'express';
import Message from '../models/Message';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { Types } from 'mongoose';

const messagesRouter = Router();

messagesRouter.get('/', auth, async (_req, res, next) => {
  try {
    const message = await Message.find().limit(30).sort({ createdAt: 1 });
    return res.send(message);
  } catch (e) {
    return next(e);
  }
});

messagesRouter.delete(
  '/:id',
  auth,
  permit('admin'),
  async (req: RequestWithUser, res, next) => {
    try {
      const _id = req.params.id;

      try {
        new Types.ObjectId(_id);
      } catch {
        return res.status(404).send({ error: 'Wrong message ID' });
      }

      if (req.user?.role === 'admin') {
        await Message.findByIdAndDelete(_id);
        return res.send({ message: 'Message was deleted by admin' });
      }
    } catch (e) {
      return next(e);
    }
  },
);

export default messagesRouter;
