import express from "express";
import { connectDB } from "./db";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

connectDB().then((db) => {
    const testCollection = db.collection("test");

    app.get("/api/ping", (_req, res) => {
        res.send({ msg: "pong" });
    });

    app.get("/api/data", async (_req, res) => {
        try {
            const items = await testCollection.find().toArray();
            res.send(items);
        } catch (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error fetching data");
        }
    });


    app.listen(3000, () => {
        console.log("🚀 Server running at http://localhost:3000");
    });
});
