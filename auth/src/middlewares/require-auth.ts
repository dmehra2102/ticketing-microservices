import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuthMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   if (!req.currentUser) {
      throw new NotAuthorizedError();
   }

   return next();
};
