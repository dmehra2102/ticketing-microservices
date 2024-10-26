import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express, { NextFunction, Request, Response } from 'express';
import { NotFoundError, errorHandler } from '@dmehra2102-microservices-/common';
import { getOrdersRouter } from './routes/getOrders';
import { createOrderRouter } from './routes/createOrder';
import { deleteOrderRouter } from './routes/deleteOrder';
import { getOrderRouter } from './routes/getOrder';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
   cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test',
   })
);

app.use('/api/order/all', getOrdersRouter);
app.use('/api/order/create', createOrderRouter);
app.use('/api/order/delete', deleteOrderRouter);
app.use('/api/order', getOrderRouter);

app.all('*', async (req, res) => {
   throw new NotFoundError(`Route ${req.originalUrl} not found`);
});

// Centralized error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   errorHandler(err, req, res, next);
});

export { app };
