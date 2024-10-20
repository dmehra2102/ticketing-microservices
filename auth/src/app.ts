import mongoose from 'mongoose';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { NotFoundError } from './errors/not-found-error';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-handler.middleware';
import express, { Application, NextFunction, Request, Response } from 'express';

class App {
   public app: Application;
   public port: Number | string;
   constructor() {
      this.app = express();
      this.port = 3000;

      this.connectToDatabase();
      this.initializeMiddleware();
      this.initializeRoutes();
      this.initializeErrorHandling();
   }

   private initializeMiddleware() {
      // Middlewares
      this.app.set('trust proxy', true);
      this.app.use(json());
      this.app.use(
         cookieSession({
            signed: false,
            secure: true,
         })
      );
   }

   private initializeRoutes() {
      // Route handlers
      this.app.use('/api/user/signin', signinRouter);
      this.app.use('/api/user/signup', signupRouter);
      this.app.use('/api/user/signout', signoutRouter);
      this.app.use('/api/user/current-user', currentUserRouter);

      // Handle undefined routes
      this.app.all('*', async (req: Request, res: Response) => {
         throw new NotFoundError(`Route ${req.originalUrl} not found`);
      });
   }

   private initializeErrorHandling() {
      // Centralized error handler middleware
      this.app.use(
         (err: Error, req: Request, res: Response, next: NextFunction) => {
            errorHandler(err, req, res, next);
         }
      );
   }

   private async connectToDatabase() {
      if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
      try {
         await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
         console.log('Connected to MongoDB');
      } catch (err) {
         console.error(err);
      }
   }

   public listen() {
      this.app.listen(this.port, () => {
         console.info(`=================================`);
         console.info(
            `🚀 🚀 Knock knock, who's there? It's your http server, listening on port ${this.port}! 🚀 🚀`
         );
         console.info(`=================================`);
      });
   }
}

export default App;
