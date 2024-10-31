import { THIRTY_DAYS } from '../constants/index.js';

export const setupCookies = (res, session) => {
  res.cookie('sessionId', session._id, { httpOnly: true, expire: THIRTY_DAYS });
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expire: THIRTY_DAYS,
  });
};
