import {
   currentUserMiddleware,
   requireAuthMiddleware,
} from '@dmehra2102-microservices-/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express.Router();

router.post(
   '/',
   currentUserMiddleware,
   requireAuthMiddleware,
   [body('token').notEmpty(), body('orderId').notEmpty()],
   async (req: Request, res: Response) => {}
);

export { router as createPaymentRoute };
