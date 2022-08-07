import express, { Express } from 'express';
import morgan from 'morgan';
import createHttpError from 'http-errors';
require('dotenv').config();

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

app.use(async (req, res, next) => {
  next(new createHttpError.NotFound());
});

app.use((err: HttpError, req: any, res: any, next: () => void): any => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
