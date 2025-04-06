// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Mongoose bağlantı durumunu global olarak önbelleğe alma
// Bu, hot reloading sırasında birden fazla bağlantı açılmasını önler
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('MongoDB bağlantısı zaten mevcut, mevcut bağlantı kullanılıyor');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    console.log('MongoDB bağlantısı başlatılıyor...');
    
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      
      // Tüm model şemalarını önceden yükle
      require('../models/Category');
      require('../models/Product');
      
      console.log('Model şemaları yüklendi');
    } catch (err) {
      console.error('MongoDB bağlantısı başlatılırken hata:', err);
      cached.promise = null;
      throw err;
    }
  }
  
  try {
    cached.conn = await cached.promise;
    console.log('MongoDB bağlantısı başarılı');
    return cached.conn;
  } catch (err) {
    console.error('MongoDB bağlantısı beklenirken hata:', err);
    cached.promise = null;
    throw err;
  }
}

export default dbConnect;