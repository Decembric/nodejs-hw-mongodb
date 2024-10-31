import {
  createUser,
  loginUser,
  logoutUser,
  refreshSession,
} from '../services/users.js';
import { setupCookies } from '../utils/setupCookies.js';

export const registerUserController = async (req, res) => {
  const { body } = req;
  const user = await createUser(body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: user.name,
      email: user.email,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { body } = req;
  const session = await loginUser(body);
  setupCookies(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserController = async (req, res) => {
  const { sessionId, sessionToken } = req.cookies;
  const session = await refreshSession(sessionId, sessionToken);
  setupCookies(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');
  res.status(204).end();
};
