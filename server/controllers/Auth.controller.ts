/* eslint-disable */
import createError from 'http-errors';
import User from '../models/User.model';
import authSchema from '../helpers/validation_schema';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../helpers/jwt_helper';
import client, { redisDelete } from '../helpers/init_redis';
import { RedisCommandArgument } from '@redis/client/dist/lib/commands';

const AuthController = {
  register: async (req: any, res: any, next: any) => {
    try {
      // const { email, password } = req.body
      // if (!email || !password) throw createError.BadRequest()
      const result = await authSchema.validateAsync(req.body);

      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        throw new createError.Conflict(
          `${result.email} is already been registered`
        );

      const user = new User(result);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(savedUser.id);

      res.send({ accessToken, refreshToken });
    } catch (error) {
      if ((error as any).isJoi === true) (error as any).status = 422;
      next(error);
    }
  },

  login: async (req: any, res: any, next: any) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user: any = await User.findOne({ email: result.email });
      if (!user) throw new createError.NotFound('User not registered');

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw new createError.Unauthorized('Username/password not valid');

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      res.send({ accessToken, refreshToken });
    } catch (error) {
      if ((error as any).isJoi === true)
        return next(new createError.BadRequest('Invalid Username/Password'));
      next(error);
    }
  },

  refreshToken: async (req: any, res: any, next: any) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new createError.BadRequest();
      const userId: string = (await verifyRefreshToken(refreshToken)) as string;

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res.send({ accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req: any, res: any, next: any) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new createError.BadRequest();
      const userId: RedisCommandArgument | RedisCommandArgument[] =
        (await verifyRefreshToken(refreshToken)) as
          | RedisCommandArgument
          | RedisCommandArgument[];

      redisDelete(userId, (val) => {
        if (!val) {
          console.log('cant delete !');
          throw new createError.InternalServerError();
        }
        console.log(val);
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;
