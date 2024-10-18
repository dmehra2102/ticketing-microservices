import express from 'express';
import bodyParser from 'body-parser';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';

const app = express();
app.use(bodyParser.json());

app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(currentUserRouter);

app.listen(3000, () => {
   console.log('Server running on port 3000!!!');
});
