import { MongoClient } from "mongodb";

const uri = "mongodb+srv://ayoub123:ayoub123@cluster0.pljwjwk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export const connectDB = async () => {
    try {
        await client.connect();
        console.log("✅ MongoDB connected");
        return client.db("matcha");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
};
