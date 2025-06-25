import dotenv from "dotenv";
dotenv.config();
// const connectionString = process.env.ATLAS_URI || "";

import mysql from 'mysql2/promise';

console.log('Connecting to MySQL database...');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

export default db;