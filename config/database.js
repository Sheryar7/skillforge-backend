import mongoose from "mongoose";
<<<<<<< HEAD

const connectDB = async () => {
=======
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    //connect to local mongodb campus database
>>>>>>> 89c774f (Initial backend upload)
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log("💚 Database connected successfully"))
        .catch((err) => {
            console.log("❌ Database connection failed");
            console.log(err);
            process.exit(1);
        });
};
export default connectDB;