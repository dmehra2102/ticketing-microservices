import 'express-async-errors'; // This package allows us to throw errors from async functions
import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser'; // No need for bodyParser, it's part of express
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { NotFoundError } from './errors/not-found-error';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-handler.middleware';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();

// Middleware
app.set('trust proxy', true);
app.use(json());
app.use(
   cookieSession({
      signed: false,
      secure: true,
   })
);

// Route handlers
app.use('/api/user/signin', signinRouter);
app.use('/api/user/signup', signupRouter);
app.use('/api/user/signout', signoutRouter);
app.use('/api/user/current-user', currentUserRouter);

// Handle undefined routes
app.all('*', async (req: Request, res: Response) => {
   throw new NotFoundError(`Route ${req.originalUrl} not found`);
});

// Centralized error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   errorHandler(err, req, res, next);
});

const createDbConnection = async () => {
   if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
   try {
      await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
      console.log('Connected to MongoDB');
   } catch (err) {
      console.error(err);
   }

   app.listen(3000, () => {
      console.log(`Server running on port 3000`);
   });
};

createDbConnection();
