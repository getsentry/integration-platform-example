import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import itemsJson from '../../../data/items.json';
import usersJson from '../../../data/users.json';
import {Item, User} from '../models';

export async function connectToDatabase() {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {dbName: 'sentryDemo'});
  mongoose.connection.on('error', err => {
    console.error(`📦 DB Error -> ${err.message}`);
  });
}

export async function loadSeedData() {
  await Promise.all([Item.create(itemsJson), User.create(usersJson)]);
}
