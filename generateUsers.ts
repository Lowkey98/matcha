import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USERS_COUNT = 50;
const BASE_UPLOAD_DIR = path.join(__dirname, 'server', 'uploads');

const INTEREST_POOL = [
  'hiking', 'music', 'cooking', 'anime', 'reading', 'coding',
  'dogs', 'travel', 'fitness', 'gaming', 'movies', 'art'
];

const SEXUAL_PREFERENCES = ['heterosexual', 'homosexual', 'bisexual'];
const GENDERS = ['male', 'female', 'nonbinary'];
const BIOGRAPHY_SAMPLES = [
  "Love deep convos and late-night walks.",
  "Coffee addict, always up for an adventure.",
  "Always coding or hiking.",
  "Traveling the world one step at a time.",
  "Gamer by night, fitness freak by day.",
  "Just looking for someone to vibe with."
];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInterests = (): string[] => {
  const shuffled = [...INTEREST_POOL].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 interests
  return shuffled.slice(0, count);
};

// Returns a random portrait URL for user n (0-based index)
const getPortraitUrl = (index: number): string => {
  // Alternate male/female
  const gender = index % 2 === 0 ? 'men' : 'women';
  const number = Math.floor(Math.random() * 100); // 0-99
  return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
};

async function downloadImage(url: string, filepath: string): Promise<void> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(filepath, response.data);
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error);
    throw error;
  }
}

async function generateUsers(): Promise<void> {
  // Hash the fixed password once
  const hashedPassword = await bcrypt.hash('ayoub123', 10);

  // Keep all user insert values here
  const usersValues: string[] = [];

  for (let i = 1; i <= USERS_COUNT; i++) {
    const userId = i;
    const folderPath = path.join(BASE_UPLOAD_DIR, String(userId));
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Download unique image for picture-{userId}-0.webp
    const portraitUrl = getPortraitUrl(i - 1);
    const mainImagePath = path.join(folderPath, `picture-${userId}-0.webp`);

    try {
      await downloadImage(portraitUrl, mainImagePath);

      // Copy main image 4 times to picture-{userId}-1.webp ... picture-{userId}-4.webp
      for (let j = 1; j <= 4; j++) {
        const copyPath = path.join(folderPath, `picture-${userId}-${j}.webp`);
        fs.copyFileSync(mainImagePath, copyPath);
      }

      // Prepare user data
      const username = `user${userId}`;
      const email = `ayoub${userId}@yopmail.com`;
      const first_name = `First${userId}`;
      const last_name = `Last${userId}`;
      const is_verified = Math.random() > 0.3 ? 1 : 0;
      const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const verification_token = is_verified ? null : uuidv4();
      const age = Math.floor(Math.random() * 20) + 18;
      const gender = getRandom(GENDERS);
      const sexual_preference = getRandom(SEXUAL_PREFERENCES);
      const interests = JSON.stringify(getRandomInterests());
      const biography = getRandom(BIOGRAPHY_SAMPLES);
      const fameRate = 0;
      const images_urls = JSON.stringify(
        Array.from({ length: 5 }, (_, idx) => `/uploads/${userId}/picture-${userId}-${idx}.webp`)
      );

      const locationObj = {
        address: `City${userId}, Country${userId}`,
        latitude: +(Math.random() * 180 - 90).toFixed(6),   // -90 to +90
        longitude: +(Math.random() * 360 - 180).toFixed(6), // -180 to +180
      };

      const location = JSON.stringify(locationObj);
      const userValues = `("${username}", "${email}", "${first_name}", "${last_name}", "${hashedPassword}", ${is_verified}, "${created_at}", ${verification_token ? `"${verification_token}"` : 'NULL'}, ${age}, "${gender}", "${sexual_preference}", '${interests}', "${biography}", '${images_urls}', '${location}', '${fameRate}')`;

      usersValues.push(userValues);

      console.log(`User ${userId}: images saved and data prepared.`);

    } catch (err) {
      console.error(`Failed to download image or prepare user ${userId}`, err);
    }
  }

  const sql = `
INSERT INTO usersInfo (
  username, email, first_name, last_name, password, is_verified, created_at,
  verification_token, age, gender, sexual_preference, interests,
  biography, images_urls, location, fame_rate
) VALUES
${usersValues.join(",\n")};
`;

  console.log('\n\n=== SQL INSERT STATEMENT ===\n\n');
  console.log(sql);
}

generateUsers().catch(console.error);