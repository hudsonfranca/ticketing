import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { ErrorHandler, NotFoundError } from '@hsftickets/common';
import CurrentUserRouter from './routes/current-user';
import SigninRouter from './routes/signin';
import SignoutRouter from './routes/signout';
import SignupRouter from './routes/signup';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(CurrentUserRouter);
app.use(SignupRouter);
app.use(SigninRouter);
app.use(SignoutRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(ErrorHandler);

export default app;
