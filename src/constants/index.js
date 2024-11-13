import path from 'node:path';

export const MONGO_DB_VARS = {
  MONGODB_USER: 'MONGODB_USER',
  MONGODB_PASSWORD: 'MONGODB_PASSWORD',
  MONGODB_URL: 'MONGODB_URL',
  MONGODB_DB: 'MONGODB_DB',
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 1000 * 60 * 15;

export const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
