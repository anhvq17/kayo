import mongoose from 'mongoose';

const connectMongoDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
};

export default connectMongoDB;
