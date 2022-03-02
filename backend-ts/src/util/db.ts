import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

export async function connectToDatabase() {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {dbName: 'sentryDemo'});
  mongoose.connection.on('error', err => {
    console.error(`📦 DB Error -> ${err.message}`);
  });
}
