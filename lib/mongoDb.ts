'use server';


import mongoose from 'mongoose';
import { Connection } from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let connection: Connection;

const dbConnect = async (): Promise<Connection> => {
  if (connection) {
    console.log("already connected...")
    return connection;
  }
  try {
    connection = await mongoose.connect(uri);
    console.log('MongoDB Connected Successfully');
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default dbConnect;
