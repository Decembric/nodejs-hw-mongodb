import createHttpError from 'http-errors';
import { SessionModel } from '../db/models/session.js';
import { UserModel } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'You should add access token'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer === 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'You should add access token'));
  }

  const session = await SessionModel.findOne({ accessToken });

  if (session === null) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UserModel.findById(session.userId);

  if (user === null) {
    return next(createHttpError(401, 'Session not found'));
  }

  req.user = { userId: user._id };

  next();
};
