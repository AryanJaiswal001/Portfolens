import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB=async()=>{
    try{
        const MONGODB_URI =
          process.env.MONGODB_URI || "mongodb://localhost:27017/portfolens";

          const conn=await mongoose.connect(MONGODB_URI);

          console.log(`MongoDB Connected: ${conn.connection.host}`);
          console.log(`Database: ${conn.connection.name}`);

          //Connection event handlers for production
          mongoose.connection.on('error',(err)=>{
            console.error(`MongoDB error: ${err.message}`);
          });

          mongoose.connection.on('disconnected',()=>{
            console.warn(`MongoDB disconnected`);
          });

          mongoose.connection.on('reconnected',()=>{
            console.log('MongoDB reconnected');
          });

          return conn;
    }
    catch (error){
        console.error(`MongoDB connection failed ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;