import express, { Request, Response } from 'express';
import { currentUserMiddleware } from '../middlewares/current-user.middleware';

const router = express.Router();

router.get('/details', currentUserMiddleware, (req: Request, res: Response) => {
   const user = req.currentUser;
   res.status(200).send({ currentUser: user || null });
});

export { router as currentUserRouter };
