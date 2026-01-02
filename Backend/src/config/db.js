import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        "MONGODB_URI environment variable is not set. Cannot connect to database."
      );
    }

    // Prevent accidental localhost connections in production
    if (
      process.env.NODE_ENV === "production" &&
      MONGODB_URI.includes("localhost")
    ) {
      throw new Error(
        "Cannot use localhost MongoDB URI in production environment"
      );
    }

    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    //Connection event handlers for production
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(`MongoDB disconnected`);
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
