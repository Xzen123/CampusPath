import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows DNS resolver failing SRV lookups on MongoDB Atlas (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if already set or not supported
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!global._mongooseConnection) {
  global._mongooseConnection = { conn: null, promise: null };
}

const cached = global._mongooseConnection;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      '❌ MONGODB_URI is not defined. Add it to .env.local:\n  MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/campuspath\n  or for local: MONGODB_URI=mongodb://localhost:27017/campuspath'
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log('✅ MongoDB connected');
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
