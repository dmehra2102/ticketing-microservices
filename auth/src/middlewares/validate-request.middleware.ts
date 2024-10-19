import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';

export const validateRequestMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
   }

   return next();
};
