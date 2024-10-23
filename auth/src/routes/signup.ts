import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models/user.model';
import express, { Request, Response } from 'express';
import { UserAttrs } from '../interfaces/user.interface';
import {
   BadRequestError,
   validateRequestMiddleware,
} from '@dmehra2102-microservices-/common';

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
   validateRequestMiddleware,
   async (req: Request, res: Response) => {
      const { email, password }: UserAttrs = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) throw new BadRequestError('Email in use');

      const user = User.build({ email, password });
      await user.save();

      // Generate JWT
      const userJwt = jwt.sign(
         {
            id: user.id,
            email: user.email,
         },
         process.env.JWT_KEY!
         // here ! sybmol is used to tell typescript that
         // we will make sure the JWT_KEY will not be undefined
      );

      // Store it on session object
      req.session = {
         jwt: userJwt,
      };

      res.status(201).send(user);
   }
);

export { router as signupRouter };
