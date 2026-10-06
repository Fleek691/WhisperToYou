import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from './src/models/User.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('YOUR_MONGODB_URI')) {
      console.log('No valid MONGODB_URI found in .env, skipping seed.');
      return;
    }

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing users for a fresh seed (Optional, uncomment if needed)
    // await UserModel.deleteMany({});
    
    const adminUser = {
      googleId: 'google-seed-admin-123',
      name: 'Admin Ladup',
      email: 'admin@whispertoyou.com',
      avatar: 'https://ui-avatars.com/api/?name=Admin+Ladup&background=800A0A&color=fff',
      role: 'admin',
    };

    const normalUser = {
      googleId: 'google-seed-user-456',
      name: 'Test Reader',
      email: 'reader@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Test+Reader',
      role: 'user',
    };

    await UserModel.findOneAndUpdate({ email: adminUser.email }, adminUser, { upsert: true, new: true });
    await UserModel.findOneAndUpdate({ email: normalUser.email }, normalUser, { upsert: true, new: true });

    console.log('🌱 Successfully seeded 1 Admin and 1 User into the database!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();
