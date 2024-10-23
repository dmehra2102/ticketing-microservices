import express, { Request, Response } from 'express';
import {
   currentUserMiddleware,
   requireAuthMiddleware,
} from '@dmehra2102-microservices-/common';

const router = express.Router();

router.post(
   '/create',
   currentUserMiddleware,
   requireAuthMiddleware,
   async (req: Request, res: Response) => {}
);

export { router as createTicketRouter };
