import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser'; // No need for bodyParser, it's part of express
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { NotFoundError } from './errors/not-found-error';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-handler.middleware';

const app = express();

// Middleware
app.use(json());

// Route handlers
app.use('/api/signin', signinRouter);
app.use('/api/signup', signupRouter);
app.use('/api/signout', signoutRouter);
app.use('/api/current-user', currentUserRouter);

// Handle undefined routes
app.all('*', (req: Request, res: Response) => {
   throw new NotFoundError(`Route ${req.originalUrl} not found`);
});

// Centralized error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   errorHandler(err, req, res, next);
});


app.listen(3000, () => {
   console.log(`Server running on port 3000`);
});
