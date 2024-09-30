import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const connectDB = async () => {
  await initMongoConnection();
  setupServer();
};

connectDB();
