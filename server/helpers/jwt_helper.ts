import JWT, { Secret } from 'jsonwebtoken';
import createError from 'http-errors';
import { redisGet, redisSet } from './init_redis';

const signAccessToken = (userId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1h',
      issuer: 'pickurpage.com',
      audience: userId,
    };
    JWT.sign(payload, secret as Secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(new createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
};
const verifyAccessToken = (req: any, res: any, next: any): void => {
  if (!req.headers['authorization'])
    return next(new createError.Unauthorized());
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];
  JWT.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as JWT.Secret,
    (err: any, payload: any) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return next(new createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    }
  );
};
const signRefreshToken = (userId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
      issuer: 'pickurpage.com',
      audience: userId,
    };
    JWT.sign(payload, secret as JWT.Secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        // reject(err)
        reject(new createError.InternalServerError());
      }

      console.log(userId, token);
      redisSet(userId, token as string, (val: string | null) => {
        if (!val) {
          console.log('redis error setting value !');
          reject(new createError.InternalServerError());
          return;
        }
        resolve(token);
      });
    });
  });
};
const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as JWT.Secret,
      (err, payload) => {
        if (err) return reject(new createError.Unauthorized());
        const userId = (payload as JWT.JwtPayload & { aud: string }).aud;

        redisGet(userId, (value) => {
          if (!value) {
            // console.log(err.message);
            reject(new createError.InternalServerError());
            return;
          }
          if (refreshToken === value) return resolve(userId);
          reject(new createError.Unauthorized());
        });
      }
    );
  });
};

export {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
