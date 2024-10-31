import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserModel } from '../db/models/user.js';
import { SessionModel } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';

export const createUser = async (userData) => {
  const user = await UserModel.findOne({ email: userData.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return UserModel.create({ ...userData, password: hashedPassword });
};

export const loginUser = async (userData) => {
  const user = await UserModel.findOne({ email: userData.email });
  if (!user) {
    throw createHttpError(401, 'Credentials are wrong');
  }
  const areEqual = await bcrypt.compare(userData.password, user.password);
  if (!areEqual) {
    throw createHttpError(401, 'Credentials are wrong');
  }
  await SessionModel.deleteOne({ userId: user._id });
  return SessionModel.create({ userId: user._id, ...createSession() });
};

export const refreshSession = async (sessionId, sessionToken) => {
  const session = await SessionModel.findOne({
    refreshToken: sessionToken,
    _id: sessionId,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired');
  }
  const user = await UserModel.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'Session not found');
  }
  await SessionModel.deleteOne({ _id: sessionId });
  return SessionModel.create({ userId: user._id, ...createSession() });
};

export const logoutUser = (sessionId) => {
  return SessionModel.deleteOne({ _id: sessionId });
};
