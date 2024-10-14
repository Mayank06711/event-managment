import mongoose from "mongoose";

// Connect to MongoDB
const connectDb = async () => {
  try {
    const connectionInst = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected... with ${connectionInst}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;
