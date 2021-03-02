import express, { json } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';


import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { signUpRouter } from './routes/sign-up';
import { errorHandler, NotFoundError } from '@tiddal/ticketing-common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.all('*', async () => { throw new NotFoundError(); });
app.use(errorHandler);

export { app };
