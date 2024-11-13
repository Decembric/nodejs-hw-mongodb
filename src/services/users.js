import createHttpError from 'http-errors';
import fs from 'fs/promises';
import path from 'node:path';
import Handlebars from 'handlebars';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { UserModel } from '../db/models/user.js';
import { SessionModel } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { TEMPLATES_DIR } from '../constants/index.js';
import { sendMail } from '../utils/sendMail.js';

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
  if (userData.email) {
    await SessionModel.deleteOne({ userId: user._id });
  }
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

export const sendEmailforUser = async (email) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const templateSource = await fs.readFile(
    path.join(TEMPLATES_DIR, 'reset-email.html'),
  );

  const template = Handlebars.compile(templateSource.toString());

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  try {
    await sendMail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html: html,
    });
  } catch (error) {
    console.error(error);

    throw createHttpError(500, 'Cannot sent email');
  }
};

export const resetPassword = async ({ password, token }) => {
  let tokenPayload;
  try {
    tokenPayload = jwt.verify(token, env('JWT_SECRET'));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.findOneAndUpdate(
    { email: tokenPayload.email, _id: tokenPayload.sub },
    { password: hashedPassword },
  );
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  await SessionModel.deleteOne({ userId: tokenPayload.sub });
};
