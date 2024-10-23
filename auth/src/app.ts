import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express, { NextFunction, Request, Response } from 'express';

import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { NotFoundError, errorHandler } from '@dmehra2102-microservices-/common';
import { currentUserRouter } from './routes/current-user';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
   cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test',
   })
);

app.use('/api/user/signin', signinRouter);
app.use('/api/user/signup', signupRouter);
app.use('/api/user/signout', signoutRouter);
app.use('/api/user/current-user', currentUserRouter);

app.all('*', async (req, res) => {
   throw new NotFoundError(`Route ${req.originalUrl} not found`);
});

// Centralized error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   errorHandler(err, req, res, next);
});

export { app };
