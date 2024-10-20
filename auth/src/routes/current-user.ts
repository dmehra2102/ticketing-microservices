import express, { Request, Response } from 'express';
import { currentUserMiddleware } from '../middlewares/current-user.middleware';
import { requireAuthMiddleware } from '../middlewares/require-auth';

const router = express.Router();

router.get(
   '/details',
   currentUserMiddleware,
   requireAuthMiddleware,
   (req: Request, res: Response) => {
      const user = req.currentUser;
      res.send({ currentUser: user || null });
   }
);

export { router as currentUserRouter };
