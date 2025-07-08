import express from 'express';
import db from './db.js';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import type { UserInfo } from '../shared/types.js';
import { isValidAge, isValidGender, isValidSexualPreference, isValidInterests, isValidBiography } from '../shared/Helpers.js';
import path, { relative } from 'path';
import fs from 'fs';
// const { isValidAge, isValidGender, isValidSexualPreference, isValidInterests, isValidBiography } = pkg;
type UserInfoFromDB = {
  created_at: Date;
  verification_token: string;
  id: string;
  age?: number;
  email: string;
  username: string;
  is_verified: boolean;
  password: string;
};
dotenv.config();
const app = express();
app.use(express.json({ limit: '11mb' }));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

app.get('/api/ping', (_req, res) => {
  res.send({ msg: 'pong' });
});

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post('/api/create-profile', async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const { age, gender, sexualPreference, interests, biography, uploadedBuffersPictures } = req.body;
    if (!!isValidAge(age) || !!isValidGender(gender) || !!isValidSexualPreference(sexualPreference) || !!isValidInterests(interests) || !!isValidBiography(biography)) {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET

      || 'default_secret',
    ) as { userId: string };
    const uploadDir = path.join(__dirname, `uploads/${decoded.userId}`);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    let imagesUrls = []
    uploadedBuffersPictures.map((buffer, index) => {
      const parts = buffer.split(',');
      const header = parts[0];
      const base64Data = parts[1];
      const ext = header.split('/')[1].split(';')[0];

      const filename = `picture-${Date.now()}-${index}.${ext}`;
      const filepath = path.join(`./uploads/${decoded.userId}`, filename);

      fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
      imagesUrls.push(filepath)
    })

    await db.execute(
      `UPDATE usersInfo 
       SET
        age
        = ?, 
        gender = ?,
        sexual_preference = ?,
        interests = ?,
        biography = ?,
        images_urls = ?
        WHERE id = ?

      `,
      [age, gender, sexualPreference, interests, biography, imagesUrls, decoded.userId],
    );
    res.status(201).json({
      message:
        'profile info added successfully',
      body: {
        age, gender, sexualPreference, interests, biography, imagesUrls
      }
    });
    return;
  } catch (err) {
    console.error('Error in /api/create-profile:', err);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});



app.post('/api/register', async (req, res) => {
  try {
    const { username, email, firstName, lastName, password } =
      req.body.registeredUser;
    if (!email || !password || !username || !firstName || !lastName) {
      res.status(400).json({
        error: 'Email, username, firstName, lastName, password are required',
      });
      return;
    }

    // Check if email or username exists
    const [rows] = await db.execute(
      'SELECT email, username FROM usersInfo WHERE email = ? OR username = ?',
      [email, username],
    );

    const userRows = rows as UserInfoFromDB[];
    const emailExists = userRows.some(
      (row: UserInfoFromDB) => row.email === email,
    );
    const usernameExists = userRows.some(
      (row: UserInfoFromDB) => row.username === username,
    );

    if (emailExists || usernameExists) {
      res.status(409).json({
        emailAlreadyExists: emailExists,
        usernameAlreadyExists: usernameExists,
      });
      return;
    }

    // Hash password and create verification token
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomUUID();

    // Insert user into DB
    await db.execute(
      `INSERT INTO usersInfo
       (username, email, first_name, last_name, password, is_verified, created_at, verification_token) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        username,
        email,
        firstName,
        lastName,
        hashedPassword,
        false,
        verificationToken,
      ],
    );

    // Send verification email
    sendVerificationEmail({ to: email, token: verificationToken });

    res.status(201).json({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
    return;
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const [rows] = await db.execute('SELECT * FROM usersInfo WHERE email = ?', [
      email,
    ]);
    const user: UserInfoFromDB = rows[0];

    if (!user) {
      res.status(400).json({ error: 'email not registered' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    if (!user.is_verified) {
      res
        .status(400)
        .json({ error: 'Email not verified. Please check your email.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' },
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isVerified: user.is_verified,
        created_at: user.created_at,
        age: user?.age,
        verification_token: user.verification_token,
        password: user.password,
      } as UserInfo,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/api/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400).send('Missing token');
      return;
    }


    const [rows] = await db.execute(
      'SELECT * FROM usersInfo WHERE verification_token = ?',
      [token],
    );

    const user: UserInfoFromDB = rows[0];
    if (!user) {
      res.status(400).send('Invalid or expired token');
      return;
    }

    await db.execute(
      'UPDATE usersInfo SET is_verified = ?, verification_token = NULL WHERE id = ?',
      [true, user.id],
    );

    res.send('<h1>Email verified successfully!</h1>');
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).send('Internal server error.');
  }
});

app.get('/api/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret',
    )
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const [row] = await db.execute('SELECT * FROM usersInfo WHERE id = ?', [
    decoded.userId,
  ]);
  const user = row[0] as UserInfo;

  if (!user) {
    console.error('User not found for token:', token);
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const userInfo = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user['first_name'],
    lastName: user['last_name'],
    age: user['age'],
    gender: user['gender'],
    sexualPreference: user['sexual_preference'],
    interests: user['interests'],
    biography: user['biography'],
    imagesUrls: user['images_urls']
  }
  res.json(userInfo);
  return;

});

app.put('/api/updateAccount', async (req, res) => {
  try {
    const { id, username, email, firstName, lastName } =
      req.body.updatedUserAccountInfo;
    if (!email || !username || !firstName || !lastName) {
      res.status(400).json({
        error: 'Email, username, firstName, lastName are required',
      });
      return;
    }

    // Check if email or username exists
    const [rows] = await db.execute(
      'SELECT username FROM usersInfo WHERE (username = ?) AND id != ?',
      [username, id],
    );

    const userRows = rows as UserInfoFromDB[];
    const usernameExists = userRows.some(
      (row: UserInfoFromDB) => row.username === username,
    );

    if (usernameExists) {
      res.status(409).json({
        usernameAlreadyExists: usernameExists,
      });
      return;
    }
    // Update user into DB
    await db.execute(
      `UPDATE usersInfo SET email = ?, username = ?, first_name = ?, last_name = ? WHERE id = ?`,
      [email, username, firstName, lastName, id],
    );

    res.status(201).json({
      message: 'Your account information has been updated successfully',
    });
    return;
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});

export async function sendVerificationEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Matcha Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Confirm Your Matcha Account',
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #ff4081;">Welcome to Matcha!</h2>
      <p>Thanks for signing up. Please verify your email address to activate your account:</p>
      <a 
        href="http://localhost:3000/api/verify?token=${token}" 
        style="display: inline-block; padding: 12px 24px; background-color: #ff4081; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;"
      >
        Verify Your Email
      </a>
      <p style="margin-top: 20px;">If you didn’t sign up for Matcha, just ignore this email.</p>
      <p>Cheers,<br/>The Matcha Team</p>
    </div>
  `,
  });

  console.log('Email sent:', info.messageId);
}

async function startServer() {
  app.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
  });
}
startServer();
