import express, { Request, Response } from 'express';
import { currentUserMiddleware } from '@dmehra2102-microservices-/common';

const router = express.Router();

router.get('/details', currentUserMiddleware, (req: Request, res: Response) => {
   const user = req.currentUser;
   res.status(200).send({ currentUser: user || null });
});

export { router as currentUserRouter };
