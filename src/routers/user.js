import express from 'express';
import {
  registerSchema,
  loginSchema,
  emailSchema,
  resetMailSchema,
} from '../db/models/user.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserController,
  registerUserController,
  resetPasswordController,
  sendEmailController,
} from '../controllers/users.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserController));

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-email',
  validateBody(emailSchema),
  ctrlWrapper(sendEmailController),
);
export default router;

router.post(
  '/reset-pwd',
  validateBody(resetMailSchema),
  ctrlWrapper(resetPasswordController),
);
