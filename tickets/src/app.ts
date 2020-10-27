import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { ErrorHandler, NotFoundError, CurrentUser } from '@hsftickets/common';
import createTicketRouter from './routes/new';
import showTicketRouter from './routes/show';
import indexTicketRouter from './routes/index';
import UpdateTicketRouter from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(CurrentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(UpdateTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(ErrorHandler);

export default app;
