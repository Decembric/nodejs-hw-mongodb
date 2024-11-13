import path from 'node:path';
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/user.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();
  const PORT = 3000;
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());
  app.use(express.json());
  app.use('/photos', express.static(path.resolve('src', 'public/photos')));
  app.use(cookieParser());
  app.get('/', (req, res) => {
    res.json({ message: 'contact' });
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
