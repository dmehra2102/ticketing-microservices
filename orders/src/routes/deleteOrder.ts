import { requireAuthMiddleware } from '@dmehra2102-microservices-/common';
import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.delete(
   '/:orderId',
   requireAuthMiddleware,
   async (req: Request, res: Response, next: NextFunction) => {}
);

export { router as deleteOrderRouter };
