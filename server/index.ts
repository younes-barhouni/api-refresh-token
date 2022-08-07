import express, { Express } from 'express';
import morgan from 'morgan';
import createHttpError from 'http-errors';
import 'dotenv/config';

import './helpers/init_mongodb';
import { verifyAccessToken } from './helpers/jwt_helper';
import './helpers/init_redis';

import AuthRoute from './routes/Auth.route';

// dotenv.config();

interface HttpError<T extends number = number> extends Error {
  status: T;
  statusCode: T;
  expose: boolean;
  headers?:
    | {
        [key: string]: string;
      }
    | undefined;
  [key: string]: any;
}

const app: Express = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res, next) => {
  res.send('Hello from express.');
});

app.get('/private', verifyAccessToken, async (req, res, next) => {
  res.send('Private content.');
});

app.use('/auth', AuthRoute);

app.use(async (req, res, next) => {
  next(new createHttpError.NotFound());
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
  (
    err: HttpError,
    req: unknown,
    res: {
      status: (arg0: number) => void;
      send: (arg0: { error: { status: number; message: string } }) => void;
    },
    next: () => void
  ): void => {
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
