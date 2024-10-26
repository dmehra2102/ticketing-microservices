import mongoose from 'mongoose';
import { body } from 'express-validator';
import express, { NextFunction, Request, Response } from 'express';
import {
   requireAuthMiddleware,
   validateRequestMiddleware,
} from '@dmehra2102-microservices-/common';

const router = express.Router();

router.post(
   '/',
   requireAuthMiddleware,
   [
      body('ticketId')
         .not()
         .isEmpty()
         .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
         .withMessage('TicketId must be provided'),
   ],
   validateRequestMiddleware,
   async (req: Request, res: Response, next: NextFunction) => {}
);

export { router as createOrderRouter };
