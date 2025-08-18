// matchaSetup.ts
import mysql from 'mysql2/promise';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USERS_COUNT = 500; // Change to 500 if you want
const BASE_UPLOAD_DIR = path.join(__dirname, 'server', 'uploads');

const INTEREST_POOL = [
  '#Music',
  '#Gaming',
  '#Reading',
  '#Writing',
  '#Movies',
  '#Traveling',
  '#Fitness',
  '#Cooking',
  '#Photography',
  '#Art',
  '#Tech',
  '#Coding',
];

const GENDERS = ['male', 'female'];
const SEXUAL_PREFERENCES = ['male', 'female'];
const BIOGRAPHY_SAMPLES = [
  'Love deep convos and late-night walks.',
  'Coffee addict, always up for an adventure.',
  'Always coding or hiking.',
  'Traveling the world one step at a time.',
  'Gamer by night, fitness freak by day.',
];

const getRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomInterests = (): string[] => {
  const shuffled = [...INTEREST_POOL].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 interests
  return shuffled.slice(0, count);
};

// Dicebear avatar generator (PNG)
// Dicebear (v9 API) avatar generator (PNG)
const getPortraitUrl = (index: number): string => {
  return `https://api.dicebear.com/9.x/adventurer/png?seed=user${index}`;
};

async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(filepath, response.data);
}

async function main() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1", // TODO:
    user: "root", // TODO: 
    password: "ayoub123", // TODO:
    multipleStatements: true,
  });
  await connection.query("CREATE DATABASE IF NOT EXISTS testdb");
  console.log("✅ Database ensured: testdb");

  await connection.changeUser({ database: "testdb" });
  console.log("✅ Now connected to testdb");

  // Create database + tables
  const schemaSQL = `
    DROP DATABASE IF EXISTS matcha;
    CREATE DATABASE matcha;
    USE matcha;

    CREATE TABLE usersInfo (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verification_token VARCHAR(255),
      age INT,
      gender VARCHAR(255),
      sexual_preference VARCHAR(255),
      interests JSON,
      biography VARCHAR(255),
      images_urls JSON,
      location TEXT,
      fame_rate INT,
      isOnline BOOLEAN DEFAULT FALSE,
      lastOnline DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE relations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      actor_user_id INT NOT NULL,
      target_user_id INT NOT NULL,
      is_like BOOLEAN DEFAULT FALSE,
      is_view_profile BOOLEAN DEFAULT FALSE,
      is_block BOOLEAN DEFAULT FALSE,
      CONSTRAINT unique_actor_target UNIQUE (actor_user_id, target_user_id)
    );

    CREATE TABLE conversations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      actor_user_id INT NOT NULL,
      target_user_id INT NOT NULL,
      message JSON
    );
  `;

  await connection.query(schemaSQL);
  console.log('Database and tables created ✅');

  // Hash password once
  const hashedPassword = await bcrypt.hash('matcha123', 10);

  // Generate fake users
  for (let i = 1; i <= USERS_COUNT; i++) {
    const userId = i;
    const folderPath = path.join(BASE_UPLOAD_DIR, String(userId));
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Download avatar from Dicebear
    const portraitUrl = getPortraitUrl(i);
    const mainImagePath = path.join(folderPath, `picture-${userId}-0.webp`);
    await downloadImage(portraitUrl, mainImagePath);

    // Copy same image 4 more times
    for (let j = 1; j <= 4; j++) {
      const copyPath = path.join(folderPath, `picture-${userId}-${j}.webp`);
      fs.copyFileSync(mainImagePath, copyPath);
    }

    // User data
    const username = `user${userId}`;
    const email = `matcha${userId}@yopmail.com`;
    const first_name = `First${userId}`;
    const last_name = `Last${userId}`;
    const is_verified = 1;
    const created_at = new Date();
    const verification_token = is_verified ? null : uuidv4();
    // age between 16 and 60
    const age = Math.floor(Math.random() * 43) + 18;
    const gender = getRandom(GENDERS);
    const sexual_preference = gender === 'male' ? 'female' : 'male';
    const interests = JSON.stringify(getRandomInterests());
    const biography = getRandom(BIOGRAPHY_SAMPLES);
    const fameRate = 0;
    const images_urls = JSON.stringify(
      Array.from(
        { length: 5 },
        (_, idx) => `uploads/${userId}/picture-${userId}-${idx}.webp`,
      ),
    );


    // const CASABLANCA_LAT = 33.5731;
    // const CASABLANCA_LON = -7.5898;

    const BENGUERIR_LAT = 32.2526;
    const BENGUERIR_LON = -7.8726;
    let latitude: number, longitude: number;

    if (userId <= 200) {
      // 200 "local" users within 10 km
      const maxDistanceKm = 10;
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.sqrt(Math.random()) * maxDistanceKm;
      const latOffset = (distance / 111.32) * Math.cos(angle);
      const lonOffset = (distance / (111.32 * Math.cos(BENGUERIR_LAT * Math.PI / 180))) * Math.sin(angle);
      latitude = +(BENGUERIR_LAT + latOffset).toFixed(6);
      longitude = +(BENGUERIR_LON + lonOffset).toFixed(6);
    } else {
      // remaining users a bit farther (e.g., 200 km)
      const maxDistanceKm = 200;
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.sqrt(Math.random()) * maxDistanceKm;
      const latOffset = (distance / 111.32) * Math.cos(angle);
      const lonOffset = (distance / (111.32 * Math.cos(BENGUERIR_LAT * Math.PI / 180))) * Math.sin(angle);
      latitude = +(BENGUERIR_LAT + latOffset).toFixed(6);
      longitude = +(BENGUERIR_LON + lonOffset).toFixed(6);
    }

    const locationObj = {
      address: `City${userId}, Country${userId}`,
      latitude,
      longitude,
    };

    const location = JSON.stringify(locationObj);

    // Insert into DB
    await connection.query(
      `INSERT INTO matcha.usersInfo
      (username, email, first_name, last_name, password, is_verified, created_at,
       verification_token, age, gender, sexual_preference, interests, biography,
       images_urls, location, fame_rate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        email,
        first_name,
        last_name,
        hashedPassword,
        is_verified,
        created_at,
        verification_token,
        age,
        gender,
        sexual_preference,
        interests,
        biography,
        images_urls,
        location,
        fameRate,
      ],
    );

    console.log(`User ${userId} created ✅`);
  }

  console.log('All users inserted successfully 🎉');
  await connection.end();
}

main().catch((err) => {
  console.error('Error:', err);
});
