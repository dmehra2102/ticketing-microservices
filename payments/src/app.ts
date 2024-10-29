import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express, { NextFunction, Request, Response } from 'express';
import { NotFoundError, errorHandler } from '@dmehra2102-microservices-/common';
import { createPaymentRoute } from './routes/createPayment';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
   cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test',
   })
);

app.use('/api/payment/create', createPaymentRoute);

app.all('*', async (req, res) => {
   throw new NotFoundError(`Route ${req.originalUrl} not found`);
});

// Centralized error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   errorHandler(err, req, res, next);
});

export { app };
