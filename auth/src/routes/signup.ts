import { User } from '../models/user.model';
import express, { Request, Response } from 'express';
import { UserAttrs } from '../interfaces/user.interface';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post(
   '/',
   [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password')
         .trim()
         .isLength({ min: 4, max: 20 })
         .withMessage('Password must be between 4 and 20 characters'),
   ],
   async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         throw new RequestValidationError(errors.array());
      }

      const { email, password }: UserAttrs = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) throw new BadRequestError('Email in use');
      
      const user = User.build({ email, password });
      await user.save();

      res.send(user);
   }
);

export { router as signupRouter };
