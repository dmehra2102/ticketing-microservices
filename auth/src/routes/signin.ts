import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models/user.model';
import { Password } from '../services/password';
import express, { Request, Response } from 'express';
import { UserAttrs } from '../interfaces/user.interface';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequestMiddleware } from '../middlewares/validate-request.middleware';

const router = express.Router();

router.post(
   '/',
   [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password').trim().notEmpty().withMessage('Password is required'),
   ],
   validateRequestMiddleware,
   async (req: Request, res: Response) => {
      const { email, password }: UserAttrs = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) throw new BadRequestError('Invalid credentials');

      const isPasswordMatched = await Password.comaparePassword(
         existingUser.password,
         password
      );
      if (!isPasswordMatched) throw new BadRequestError('Invalid credentials');

      const userJwt = jwt.sign(
         {
            id: existingUser.id,
            email: existingUser.email,
         },
         process.env.JWT_KEY!
      );

      req.session = {
         jwt: userJwt,
      };

      res.send(existingUser);
   }
);

export { router as signinRouter };
