/* import { MongoClient } from "mongodb";

let client;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });
    await client.connect();
  }

  return client.db(process.env.DATABASE_NAME);
} */

import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
/* 
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
} */

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((error) => {
        throw new Error("Failed to connect to database: " + error.message);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
