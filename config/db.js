
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const url = process.env.MONGODB_URL;

        if (!url) {
            throw new Error("MONGODB_URL is missing in .env file");
        }

        await mongoose.connect(url);
        console.log("MongoDB Connected");
    } catch (e) {
        console.log("Database Error:", e.message);
        process.exit(1);
    }
};

export default connectDB;
