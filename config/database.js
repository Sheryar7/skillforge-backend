import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    // Connect to MongoDB using the URL from environment variables
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log("Database connected successfully"))
        .catch((err) => {
            console.log("Database connection failed");
            console.log(err);
            process.exit(1);
        });
};

export default connectDB;