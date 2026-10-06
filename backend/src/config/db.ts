import mongoose from 'mongoose';

// In-Memory store fallback if MongoDB connection is not configured or unavailable during local dev
export const inMemoryDB = {
  orders: [] as any[],
  reviews: [] as any[],
  contactMessages: [] as any[],
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('YOUR_MONGODB_URI')) {
    console.warn('⚠️  MONGODB_URI not set or using default. Running with in-memory persistence fallback for seamless testing.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅  MongoDB connected successfully');
  } catch (error) {
    console.error('❌  MongoDB connection error:', error);
    console.warn('⚠️  Falling back to in-memory store mode for development.');
  }
};
