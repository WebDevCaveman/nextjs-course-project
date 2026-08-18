import mongoose, { Mongoose } from "mongoose";
import logger from "./logger";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Dzieki temu unikamy wielokrotnego tworzenia połączenia z bazą danych podczas hot reloadu w Next.js - czyli normalnie kazde zapytanie do API powoduje tworzenie nowego połączenia z bazą danych, co jest nieefektywne i może prowadzić do błędów. Zamiast tego, przechowujemy połączenie w pamięci globalnej, aby było dostępne dla wszystkich zapytań.

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info("Using existing mongoose connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: "DevFlow" })
      .then((result) => {
        logger.info("New mongoose connection established");
        return result;
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
