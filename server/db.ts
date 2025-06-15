import { MongoClient } from "mongodb";
import type { Db } from "mongodb";

import dotenv from "dotenv";
dotenv.config();
const connectionString = process.env.ATLAS_URI || "";
console.log("connectionString:", connectionString)
const client = new MongoClient(connectionString);
let conn;
try {
    conn = await client.connect();
} catch (e) {
    console.error(e);
}
let db: Db;
if (conn) {
    db = conn.db("matcha");
} else {
    throw new Error("Failed to connect to the database.");
}
export default db;