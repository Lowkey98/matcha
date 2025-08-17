import express from 'express';
import type { Request, Response } from 'express';
import db from './db.ts';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';
import http from 'http';
import jwt from 'jsonwebtoken';
import { getDistance } from 'geolib';

import dotenv from 'dotenv';
import type {
  ConversationUserInfo,
  CreateProfileRequest,
  LoginRequest,
  Message,
  MessageRequest,
  NotificationResponse,
  RegisterRequest,
  RelationRequest,
  UpdatedUserProfileInfos,
  UserConversationsSummary,
  UserInfo,
  UserInfoBase,
  UserInfoWithRelation,
  UserInfoWithCommonTags,
} from '../shared/types.ts';
import {
  isValidAge,
  isValidGender,
  isValidSexualPreference,
  isValidInterests,
  isValidBiography,
} from '../shared/Helpers.ts';
import path from 'path';
import fs from 'fs';

const MAX_DISTANCE_METERS = 10000; // 10 km
export function getDistanceInKilometers({
  actorUserInfo,
  targetUserInfo,
}: {
  actorUserInfo: UserInfo | null;
  targetUserInfo: UserInfoWithRelation | UserInfo | null;
}) {
  // console.log("actorUserInfo", actorUserInfo)
  // console.log("targetUserInfo", targetUserInfo)
  const distanceInMeters =
    targetUserInfo.location && actorUserInfo.location
      ? getDistance(
        {
          latitude: actorUserInfo.location.latitude || 0, // TODO
          longitude: actorUserInfo.location.longitude || 0,
        },
        {
          latitude: targetUserInfo.location.latitude || 0,
          longitude: targetUserInfo.location.longitude || 0,
        },
      )
      : undefined;
  const distanceInKilometers = distanceInMeters
    ? Math.round(distanceInMeters / 1000)
    : undefined;
  return distanceInKilometers;
}

type UserInfoFromDB = {
  created_at: Date;
  id: string;
  age?: number;
  email: string;
  username: string;
  is_verified: boolean;
  password: string;
};
dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(express.json({ limit: '11mb' }));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/ping', (_req, res) => {
  res.send({ msg: 'pong' });
});

import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

export const BACKEND_STATIC_FOLDER = 'http://localhost:3000/';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

const onlineUsers = new Map();

app.post(
  '/api/create-profile',
  async (req: Request<{}, {}, CreateProfileRequest>, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const {
        age,
        gender,
        sexualPreference,
        interests,
        biography,
        uploadedBuffersPictures,
        location,
      } = req.body;
      if (
        !!isValidAge(age) ||
        !!isValidGender(gender) ||
        !!isValidSexualPreference(sexualPreference) ||
        !!isValidInterests(interests) ||
        !!isValidBiography(biography)
      ) {
        res.status(400).json({ error: 'Invalid input data' });
        return;
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret',
      ) as { userId: string };
      const uploadDir = path.join(__dirname, `uploads/${decoded.userId}`);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      let imagesUrls = [];
      uploadedBuffersPictures.map((buffer, index) => {
        const parts = buffer.split(',');
        const header = parts[0];
        const base64Data = parts[1];
        const ext = header.split('/')[1].split(';')[0];

        const filename = `picture-${Date.now()}-${index}.${ext}`;
        const filepath = path.join(`./uploads/${decoded.userId}`, filename);

        fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
        imagesUrls.push(filepath);
      });

      await db.execute(
        `UPDATE usersInfo 
       SET
        age
        = ?, 
        gender = ?,
        sexual_preference = ?,
        interests = ?,
        biography = ?,
        location = ?,
        images_urls = ?
        WHERE id = ?
      `,
        [
          age,
          gender,
          sexualPreference,
          interests,
          biography,
          location,
          imagesUrls,
          decoded.userId,
        ],
      );
      console.log(
        age,
        gender,
        sexualPreference,
        interests,
        location,
        biography,
        imagesUrls,
      );

      res.status(201).json({
        body: {
          age,
          gender,
          sexualPreference,
          interests,
          location,
          biography,
          imagesUrls,
        },
      });
      return;
    } catch (err) {
      console.error('Error in /api/create-profile:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  },
);
app.post(
  '/api/updateEmail',
  async (req: Request<{}, {}, { email: string; id: string }>, res) => {
    try {
      const { email, id } = req.body;
      console.log('Updating email:', email);
      if (!email) {
        res.status(400).json({
          error: 'Email',
        });
        return;
      }
      // Check if email already exists
      const [rows] = await db.execute(
        'SELECT email FROM usersInfo WHERE email = ?',
        [email],
      );

      const userRows = rows as UserInfoFromDB[];
      console.log('userRows', userRows);
      const emailExists = userRows.some(
        (row: UserInfoFromDB) => row.email === email,
      );
      console.log('emailExists', emailExists);

      if (emailExists) {
        res.status(409).json({
          emailAlreadyExists: emailExists,
        });
        return;
      }
      const verificationToken = randomUUID();
      // update verification token in the database
      console.log('Updating verification token for user ID:', id);
      await db.execute(
        'UPDATE usersInfo SET verification_token = ? WHERE id = ?',
        [verificationToken, id],
      );
      console.log('verificationToken', verificationToken);
      sendVerificationUpdateEmail({ to: email, token: verificationToken });

      res.status(201).json({
        message: 'Please check your new email.', // TODO: change this message
      });
      return;
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Internal server error.' });
      return;
    }
  },
);

app.post(
  '/api/register',
  async (req: Request<{}, {}, RegisterRequest>, res) => {
    try {
      const { username, email, firstName, lastName, password } = req.body;
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
  },
);

app.post('/api/login', async (req: Request<{}, {}, LoginRequest>, res) => {
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
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
app.post('/api/like', async (req: Request<{}, {}, RelationRequest>, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { actorUserId, targetUserId } = req.body;
  try {
    await db.execute(
      `INSERT INTO relations (actor_user_id, target_user_id, is_like)
   VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE is_like = VALUES(is_like)`,
      [actorUserId, targetUserId, true],
    );
    const [row] = await db.execute('SELECT * FROM usersInfo WHERE id = ?', [
      actorUserId,
    ]);

    const [targetUserRow] = await db.execute(
      'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_like = ?',
      [targetUserId, actorUserId, true],
    );

    const actorUserInfo = row[0];
    const actorNotification: NotificationResponse = {
      actorUserId: actorUserId,
      actorUsername: actorUserInfo.username,
      actorUserImageUrl: actorUserInfo['images_urls'][0],
      message: 'liked your profile.',
    };

    if (targetUserRow[0]) actorNotification.message = 'matched with you.';
    const targetSocketId = onlineUsers.get(targetUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('receiveNotification', actorNotification);
    }
    res.status(201).json({
      message: 'like applied successfully.',
    });
    return;
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
});
app.post('/api/unlike', async (req: Request<{}, {}, RelationRequest>, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { actorUserId, targetUserId } = req.body;
  try {
    await db.execute(
      `INSERT INTO relations (actor_user_id, target_user_id, is_like)
   VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE is_like = VALUES(is_like)`,
      [actorUserId, targetUserId, false],
    );

    await db.execute(
      `DELETE FROM conversations WHERE actor_user_id = ? AND target_user_id = ?`,
      [actorUserId, targetUserId],
    );

    await db.execute(
      `DELETE FROM conversations WHERE actor_user_id = ? AND target_user_id = ?`,
      [targetUserId, actorUserId],
    );

    res.status(201).json({
      message: 'unlike applied successfully.',
    });
    return;
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
});

app.post(
  '/api/viewProfile',
  async (req: Request<{}, {}, RelationRequest>, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { actorUserId, targetUserId } = req.body;
    try {
      await db.execute(
        `UPDATE usersInfo
        SET fame_rate = fame_rate + 1
            WHERE id = ?;`,
        [targetUserId],
      );
      await db.execute(
        `INSERT INTO relations (actor_user_id, target_user_id, is_view_profile)
   VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE is_view_profile = VALUES(is_view_profile)`,
        [actorUserId, targetUserId, true],
      );

      const [row] = await db.execute('SELECT * FROM usersInfo WHERE id = ?', [
        actorUserId,
      ]);

      const actorUserInfo = row[0];
      const actorNotification: NotificationResponse = {
        actorUserId: actorUserId,
        actorUsername: actorUserInfo.username,
        actorUserImageUrl: actorUserInfo['images_urls'][0],
        message: 'viewed your profile.',
      };

      const targetSocketId = onlineUsers.get(targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('receiveNotification', actorNotification);
      }
      res.status(201).json({
        message: 'view profile applied successfully.',
      });
      return;
    } catch (err) {
      res.status(500).json({ error: 'Internal server error.' });
      return;
    }
  },
);
app.post('/api/block', async (req: Request<{}, {}, RelationRequest>, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { actorUserId, targetUserId } = req.body;
  try {
    await db.execute(
      `INSERT INTO relations (actor_user_id, target_user_id, is_like, is_view_profile, is_block)
   VALUES (?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE is_like = VALUES(is_like), is_view_profile = VALUES(is_view_profile), is_block = VALUES(is_block)`,
      [actorUserId, targetUserId, false, false, true],
    );

    await db.execute(
      `DELETE FROM conversations WHERE actor_user_id = ? AND target_user_id = ?`,
      [actorUserId, targetUserId],
    );

    await db.execute(
      `DELETE FROM conversations WHERE actor_user_id = ? AND target_user_id = ?`,
      [targetUserId, actorUserId],
    );

    res.status(201).json({
      message: 'block applied successfully.',
    });
    return;
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
});

app.post(
  '/api/sendMessage',
  async (req: Request<{}, {}, MessageRequest>, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { actorUserId, targetUserId, message } = req.body;

    try {
      const maxLength = 2000;
      if (message.description.length > maxLength) {
        res.send(4000);
        return;
      }
      const [actorBlockRow] = await db.execute(
        'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_block = ?',
        [actorUserId, targetUserId, true],
      );

      const [targetBlockRow] = await db.execute(
        'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_block = ?',
        [targetUserId, actorUserId, true],
      );
      if (actorBlockRow[0] || targetBlockRow[0]) {
        res.json({ redirectUrl: '/explore' });
        return;
      }
      const [actorLikeRow] = await db.execute(
        'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_like = ?',
        [actorUserId, targetUserId, true],
      );

      const [targetLikeRow] = await db.execute(
        'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_like = ?',
        [targetUserId, actorUserId, true],
      );

      const isTwoUsersMatch =
        actorLikeRow[0] && targetLikeRow[0] ? true : false;
      if (!isTwoUsersMatch) {
        res.json({ redirectUrl: '/explore' });
        return;
      }
      await db.execute(
        `INSERT INTO conversations
       (actor_user_id, target_user_id, message) 
       VALUES (?, ?, ?)`,
        [actorUserId, targetUserId, message],
      );
      const [rowActorUserInfo] = await db.execute(
        'SELECT * FROM usersInfo WHERE id = ?',
        [actorUserId],
      );
      const actorUserInfo = rowActorUserInfo[0];
      const actorNotification: NotificationResponse = {
        actorUserId: actorUserId,
        actorUsername: actorUserInfo.username,
        actorUserImageUrl: actorUserInfo['images_urls'][0],
        message: 'send you a message.',
      };
      const targetSocketId = onlineUsers.get(targetUserId);
      const actorSocketId = onlineUsers.get(actorUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('receiveMessage', message);
        io.to(targetSocketId).emit('receiveNotification', actorNotification);
      }
      if (actorSocketId) io.to(actorSocketId).emit('receiveMessage', message);

      res.status(201).json({
        message: 'message sended successfully.',
      });
      return;
    } catch (err) {
      res.status(500).json({ error: 'Internal server error.' });
      return;
    }
  },
);

app.get('/api/verifyUpdateEmail', async (req, res) => {
  try {
    const { token, email } = req.query;
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
      'UPDATE usersInfo SET email = ?, verification_token = NULL WHERE id = ?',
      [email, user.id],
    );
    res.redirect('http://localhost:5173/verifyemail?status=success');
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).send('Internal server error.');
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
    res.redirect('http://localhost:5173/verifyemail?status=success');
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).send('Internal server error.');
  }
});

app.get('/api/getAllUsers', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const [UserRow] = await db.execute('SELECT * FROM usersInfo WHERE id = ?', [
    decoded.userId,
  ]);
  const currentUser = UserRow[0] as UserInfo;
  const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male';
  const [row] = await db.execute(
    'SELECT * FROM usersInfo WHERE gender = ? AND age IS NOT NULL',
    [oppositeGender],
  );
  const usersInfoFromDB = row as UserInfo[];
  const unpromisedMappedWithBlockedUsers = usersInfoFromDB.map(async (user) => {
    const [relationRow] = await db.execute(
      'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_block = ?',
      [currentUser.id, user.id, true],
    );
    const [targetRelationRow] = await db.execute(
      'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_block = ?',
      [user.id, currentUser.id, true],
    );
    const isBlocked = relationRow[0] || targetRelationRow[0] ? true : false;
    // if (user.id === currentUser.id) return false; // don't include self in the
    return isBlocked ? null : user;
  });
  const mappedWithBlockedUsers = await Promise.all(
    unpromisedMappedWithBlockedUsers,
  );
  const filteredWithBlockedUsers = mappedWithBlockedUsers.filter(Boolean);
  const usersInfoWithCommon: UserInfoWithCommonTags[] = filteredWithBlockedUsers
    .map((user) => {
      return {
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
        imagesUrls: user['images_urls'],
        location:
          typeof user['location'] === 'string' && JSON.parse(user['location']),
        fameRate: user['fame_rate'],
        isOnline: user['isOnline'],
        lastOnline: user['lastOnline']
      };
    })
    .map((user) => {
      const commonTagsCount = user.interests
        ? user.interests.filter((interest) =>
          currentUser.interests.includes(interest),
        ).length
        : 0;
      const distanceBetween = getDistanceInKilometers({
        actorUserInfo: user,
        targetUserInfo: currentUser,
      });

      return {
        ...user,
        commonTagsCount,
        distanceBetween,
      };
    }).filter((user) => {
      return user.distanceBetween && user.distanceBetween <= MAX_DISTANCE_METERS; // TODO: IS IT METERS OR KM?
    });
  const MINIMUM_SUGGESTED_USERS = 50 // TODO: global
  if (usersInfoWithCommon.length < MINIMUM_SUGGESTED_USERS) {
    res.json(usersInfoWithCommon);
    return
  }
  const groupedByTags: Record<number, UserInfoWithCommonTags[]> = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [] // 5 is number of possible tags
  };

  for (const user of usersInfoWithCommon) {
    groupedByTags[user.commonTagsCount].push(user);
  }
  let selectedUsers: UserInfoWithCommonTags[] = [];
  for (let i = 5; i >= 0; i--) {
    if (selectedUsers.length < MINIMUM_SUGGESTED_USERS) {
      selectedUsers = selectedUsers.concat(groupedByTags[i]);
    }
  }
  selectedUsers.sort((a, b) => b.fameRate - a.fameRate);
  res.json(selectedUsers);
  return;
});

app.get('/api/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const [row] = await db.execute('SELECT * FROM usersInfo WHERE id = ?', [
    decoded.userId,
  ]);
  console.log;
  const user = row[0] as UserInfo;

  if (!user) {
    console.error('User not found for token:', token);
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const userInfo: UserInfo = {
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
    imagesUrls: user['images_urls'],
    location:
      typeof user['location'] === 'string' && JSON.parse(user['location']),
    fameRate: user['fame_rate'],
    isOnline: user['isOnline'],
    lastOnline: user['lastOnline'],
  };
  res.json(userInfo);
  return;
});

app.get(
  '/api/userWithRelation/:actorUserId/:targetUserId',
  async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const actorUserId = req.params.actorUserId;
    const targetUserId = req.params.targetUserId;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    } catch (err) {
      console.error('JWT verification error:', err);
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    const [row] = await db.execute('SELECT * FROM usersInfo WHERE id = ?', [
      targetUserId,
    ]);
    const targetUser = row[0] as UserInfo;

    if (!targetUser) {
      console.error('User not found for token:', token);
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const userInfo: UserInfoWithRelation = {
      id: targetUser.id,
      email: targetUser.email,
      username: targetUser.username,
      firstName: targetUser['first_name'],
      lastName: targetUser['last_name'],
      age: targetUser['age'],
      gender: targetUser['gender'],
      sexualPreference: targetUser['sexual_preference'],
      interests: targetUser['interests'],
      biography: targetUser['biography'],
      imagesUrls: targetUser['images_urls'],
      location:
        typeof targetUser['location'] === 'string' &&
        JSON.parse(targetUser['location']),
      isLike: false,
      isViewProfile: false,
      isBlock: false,
      isOnline: targetUser['isOnline'],
      lastOnline: targetUser['lastOnline'],
      fameRate: targetUser['fame_rate'],
    };
    const [rowRelation] = await db.execute(
      'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ?',
      [Number(actorUserId), Number(targetUserId)],
    );

    const relation = rowRelation[0];

    if (relation) {
      userInfo.isLike = relation['is_like'];
      userInfo.isBlock = relation['is_block'];
      userInfo.isViewProfile = relation['is_view_profile'];
    }
    res.json(userInfo);
    return;
  },
);

app.get('/api/conversationUserInfo/:targetUserId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const targetUserId = req.params.targetUserId;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const [row] = await db.execute('SELECT * FROM usersInfo WHERE id = ?', [
    targetUserId,
  ]);
  const targetUser = row[0] as UserInfo;

  if (!targetUser) {
    console.error('User not found for token:', token);
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const userInfo: ConversationUserInfo = {
    id: targetUser.id,
    username: targetUser.username,
    imageUrl: targetUser['images_urls'][0],
    isOnline: targetUser['isOnline'],
    lastOnline: targetUser['lastOnline'],
  };

  res.json(userInfo);
  return;
});

app.get('/api/likes/:actorUserId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const actorUserId = req.params.actorUserId;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const [rowsLikes] = await db.execute<[]>(
    'SELECT * FROM relations WHERE actor_user_id = ? AND is_like = ?',
    [actorUserId, true],
  );

  if (!rowsLikes.length) {
    res.status(404).json({ message: 'likes not found' });
    return;
  }

  const likedUsers: UserInfo[] = [];

  for (let index = 0; index < rowsLikes.length; index++) {
    const likedUser = rowsLikes[index];
    const [targetUserRow] = await db.execute(
      'SELECT * FROM usersInfo WHERE id = ?',
      [likedUser['target_user_id']],
    );
    const targetUser = targetUserRow[0] as UserInfo;
    if (!targetUser) {
      res.status(404).json({ message: 'user not found' });
      return;
    }
    const userInfo: UserInfo = {
      id: targetUser.id,
      email: targetUser.email,
      username: targetUser.username,
      firstName: targetUser['first_name'],
      lastName: targetUser['last_name'],
      age: targetUser['age'],
      gender: targetUser['gender'],
      sexualPreference: targetUser['sexual_preference'],
      interests: targetUser['interests'],
      biography: targetUser['biography'],
      imagesUrls: targetUser['images_urls'],
      location:
        typeof targetUser['location'] === 'string' &&
        JSON.parse(targetUser['location']),
      isOnline: targetUser['isOnline'],
      lastOnline: targetUser['lastOnline'],
    };
    likedUsers.push(userInfo);
  }
  res.json(likedUsers);
  return;
});

app.get('/api/viewers/:targetUserId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const targetUserId = req.params.targetUserId;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const [rowsViewers] = await db.execute<[]>(
    'SELECT * FROM relations WHERE target_user_id = ? AND is_view_profile = ?',
    [targetUserId, true],
  );

  if (!rowsViewers.length) {
    res.status(404).json({ message: 'viewers not found' });
    return;
  }

  const viewedUsers: UserInfo[] = [];

  for (let index = 0; index < rowsViewers.length; index++) {
    const viewedUser = rowsViewers[index];
    const [actorUserRow] = await db.execute(
      'SELECT * FROM usersInfo WHERE id = ?',
      [viewedUser['actor_user_id']],
    );
    const actorUserInfo = actorUserRow[0] as UserInfo;
    if (!actorUserInfo) {
      res.status(404).json({ message: 'user not found' });
      return;
    }

    const userInfo: UserInfo = {
      id: actorUserInfo.id,
      email: actorUserInfo.email,
      username: actorUserInfo.username,
      firstName: actorUserInfo['first_name'],
      lastName: actorUserInfo['last_name'],
      age: actorUserInfo['age'],
      gender: actorUserInfo['gender'],
      sexualPreference: actorUserInfo['sexual_preference'],
      interests: actorUserInfo['interests'],
      biography: actorUserInfo['biography'],
      imagesUrls: actorUserInfo['images_urls'],
      location:
        typeof actorUserInfo['location'] === 'string' &&
        JSON.parse(actorUserInfo['location']),
      isOnline: actorUserInfo['isOnline'],
      lastOnline: actorUserInfo['lastOnline'],
    };

    viewedUsers.push(userInfo);
  }
  res.json(viewedUsers);
  return;
});
app.get('/api/matches/:actorUserId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const actorUserId = req.params.actorUserId;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const [rowsLikes] = await db.execute<[]>(
    'SELECT * FROM relations WHERE actor_user_id = ? AND is_like = ?',
    [actorUserId, true],
  );

  if (!rowsLikes.length) {
    res.status(404).json({ message: 'likes not found' });
    return;
  }

  const matchedUsers: UserInfo[] = [];

  for (let index = 0; index < rowsLikes.length; index++) {
    const matchedUser = rowsLikes[index];
    const [matchedUserRow] = await db.execute(
      'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_like = ?',
      [matchedUser['target_user_id'], actorUserId, true],
    );
    if (matchedUserRow[0]) {
      const [targetUserRow] = await db.execute(
        'SELECT * FROM usersInfo WHERE id = ?',
        [matchedUser['target_user_id']],
      );
      const targetUser = targetUserRow[0] as UserInfo;
      if (!targetUser) {
        res.status(404).json({ message: 'user not found' });
        return;
      }
      const userInfo: UserInfo = {
        id: targetUser.id,
        email: targetUser.email,
        username: targetUser.username,
        firstName: targetUser['first_name'],
        lastName: targetUser['last_name'],
        age: targetUser['age'],
        gender: targetUser['gender'],
        sexualPreference: targetUser['sexual_preference'],
        interests: targetUser['interests'],
        biography: targetUser['biography'],
        imagesUrls: targetUser['images_urls'],
        location:
          typeof targetUser['location'] === 'string' &&
          JSON.parse(targetUser['location']),
        isOnline: targetUser['isOnline'],
        lastOnline: targetUser['lastOnline'],
      };
      matchedUsers.push(userInfo);
    }
  }
  res.json(matchedUsers);
  return;
});

app.get('/api/userConversationsSummary/:userId', async (req, res) => {
  const userId = Number(req.params.userId);
  const [rowsConversations] = await db.execute<[]>(
    'SELECT * FROM conversations WHERE actor_user_id = ? OR target_user_id = ?',
    [userId, userId],
  );
  const conversationsFromDb: MessageRequest[] =
    rowsConversations as MessageRequest[];
  const conversationsIndexs: number[] = [];
  const sortedConversations: { userId: number; messages: Message[] }[] = [];
  for (let index = 0; index < conversationsFromDb.length; index++) {
    const conversationFromDb = conversationsFromDb[index];
    const targetConversationId =
      conversationFromDb['actor_user_id'] === userId
        ? conversationFromDb['target_user_id']
        : conversationFromDb['actor_user_id'];
    if (!conversationsIndexs.includes(targetConversationId))
      conversationsIndexs.push(targetConversationId);
  }
  for (let index = 0; index < conversationsIndexs.length; index++) {
    const conversationIndex = conversationsIndexs[index];
    const conversations: Message[] = getConversationsFromUser({
      targetUserId: conversationIndex,
      conversationsFromDb,
    });
    sortedConversations.push({
      userId: conversationIndex,
      messages: conversations,
    });
  }
  const userConversationsSummary: UserConversationsSummary[] = [];
  for (let index = 0; index < sortedConversations.length; index++) {
    const sortedConversation = sortedConversations[index];
    const [rowUser] = await db.execute('SELECT * FROM usersInfo WHERE id = ?', [
      sortedConversation.userId,
    ]);
    const userInfo = rowUser[0] as UserInfo;
    userConversationsSummary.push({
      id: sortedConversation.userId,
      imageUrl: userInfo['images_urls'][0],
      username: userInfo.username,
      lastMessage:
        sortedConversation.messages[sortedConversation.messages.length - 1]
          .description,
      isOnline: userInfo['isOnline'],
      lastOnline: userInfo['lastOnline'],
      time: sortedConversation.messages[sortedConversation.messages.length - 1]
        .time,
    });
  }

  res.status(201).json(userConversationsSummary);
  return;
});

app.get(
  '/api/conversationsBetweenTwoUsers/:actorUserId/:targetUserId',
  async (req, res) => {
    const { actorUserId, targetUserId } = req.params;
    const [rowsConversations] = await db.execute<[]>(
      'SELECT * FROM conversations WHERE actor_user_id = ? OR target_user_id = ?',
      [actorUserId, actorUserId],
    );
    const conversationsFromDb: MessageRequest[] =
      rowsConversations as MessageRequest[];
    const conversation: Message[] = getConversationsFromUser({
      targetUserId: Number(targetUserId),
      conversationsFromDb,
    });
    res.status(201).json(conversation);
    return;
  },
);

app.get(
  '/api/checkTwoUsersMatch/:actorUserId/:targetUserId',
  async (req, res) => {
    const { actorUserId, targetUserId } = req.params;
    const [actorBlockRow] = await db.execute(
      'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_block = ?',
      [actorUserId, targetUserId, true],
    );

    const [targetBlockRow] = await db.execute(
      'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_block = ?',
      [targetUserId, actorUserId, true],
    );
    if (actorBlockRow[0] || targetBlockRow[0]) {
      res.status(201).send(false);
      return;
    }
    const [actorLikeRow] = await db.execute(
      'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_like = ?',
      [actorUserId, targetUserId, true],
    );

    const [targetLikeRow] = await db.execute(
      'SELECT * FROM relations WHERE actor_user_id = ? AND target_user_id = ? AND is_like = ?',
      [targetUserId, actorUserId, true],
    );

    const isTwoUsersMatch = actorLikeRow[0] && targetLikeRow[0] ? true : false;
    res.status(201).send(isTwoUsersMatch);
    return;
  },
);

app.post(
  '/api/sendForgotPasswordMail',
  async (req: Request<{}, {}, { email: string }>, res: Response<any>) => {
    const { email } = req.body;
    const [row] = await db.execute('SELECT * FROM usersInfo WHERE email = ?', [
      email,
    ]);
    const user = row[0] as UserInfo;

    if (!user) {
      console.error('User not found for email:', email);
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' },
    );
    sendForgotPasswordMail({ to: email, token })
      .then(() => {
        res.status(200).json({ message: 'Email sent successfully' });
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
      });
    return;
  },
);

app.post(
  '/api/saveNewPassword',
  async (
    req: Request<{}, {}, { password: string; token: string }>,
    res: Response,
  ) => {
    const { password, token } = req.body;
    if (!password || !token) {
      res.status(400).json({ error: 'Password and token are required' });
      return;
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    } catch (err) {
      console.error('JWT verification error:', err);
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'UPDATE usersInfo SET password = ?, verification_token = NULL WHERE id = ?',
      [hashedPassword, decoded.userId],
    );
    console.log('Password updated successfully for user ID:', decoded.userId);
    res.status(200).json({ message: 'Password updated successfully' });
    return;
  },
);
app.put(
  '/api/updateAccount',
  async (req: Request<{}, {}, UserInfoBase>, res) => {
    try {
      const { id, username, email, firstName, lastName } = req.body;
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
  },
);

app.put(
  '/api/updateProfile',
  async (
    req: Request<{}, {}, UpdatedUserProfileInfos & { token: string }>,
    res,
  ) => {
    try {
      const {
        id,
        age,
        gender,
        sexualPreference,
        biography,
        location,
        interests,
        imagesUrls,
        token,
      } = req.body;
      if (
        !age ||
        !gender ||
        !sexualPreference ||
        !biography ||
        !location ||
        !interests ||
        !imagesUrls
      ) {
        res.status(400).json({
          error:
            'Age, gender, sexualPreference, interests, location, imagesUrls are required',
        });
        return;
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret',
      ) as { userId: string };
      const [row] = await db.execute(
        'SELECT images_urls FROM usersInfo WHERE id = ?',
        [id],
      );
      const imagesUrlsFromDb = row[0]['images_urls'] as string[];

      imagesUrlsFromDb.forEach((imageUrlFromDb) => {
        const imageUrlExistsInImagesUrls = imagesUrls.find((imageUrl) => {
          return (
            imageUrl.includes(BACKEND_STATIC_FOLDER) &&
            imageUrl.replace(BACKEND_STATIC_FOLDER, '') === imageUrlFromDb
          );
        });
        if (!imageUrlExistsInImagesUrls) {
          if (fs.existsSync(imageUrlFromDb)) fs.unlinkSync(imageUrlFromDb);
        }
      });
      let imagesUrlsToDb = [];
      imagesUrls.map((buffer, index) => {
        let filepath: string | null = null;
        if (!buffer.includes(BACKEND_STATIC_FOLDER)) {
          const parts = buffer.split(',');
          const header = parts[0];
          const base64Data = parts[1];
          const ext = header.split('/')[1].split(';')[0];

          const filename = `picture-${Date.now()}-${index}.${ext}`;
          filepath = path.join(`./uploads/${decoded.userId}`, filename);

          fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
          imagesUrlsToDb.push(filepath);
        } else {
          filepath = buffer;
          imagesUrlsToDb.push(filepath.replace(BACKEND_STATIC_FOLDER, ''));
        }
      });

      // Update user profile info into DB
      await db.execute(
        `UPDATE usersInfo SET age = ?, gender = ?, sexual_preference = ?, biography = ?, interests = ?, location= ?, images_urls = ?  WHERE id = ?`,
        [
          age,
          gender,
          sexualPreference,
          biography,
          interests,
          location,
          imagesUrlsToDb,
          id,
        ],
      );

      res.status(201).json({
        age,
        gender,
        sexualPreference,
        biography,
        interests,
        location,
        imagesUrls: imagesUrlsToDb,
      });
      return;
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ error: 'Internal server error.' });
      return;
    }
  },
);

export async function sendVerificationUpdateEmail({
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

  await transporter.sendMail({
    from: `"Matcha Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Update your Email Address',
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #ff4081;">Welcome to Matcha!</h2>
      <p>if you want to update your Matcha email, please click below:</p>
      <a 
href="http://localhost:3000/api/verifyUpdateEmail?token=${token}&email=${to}"
        style="display: inline-block; padding: 12px 24px; background-color: #ff4081; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;"
      >
        Update Your Email
      </a>
      <p style="margin-top: 20px;">If you didn’t sign up for Matcha, just ignore this email.</p>
      <p>Cheers,<br/>The Matcha Team</p>
    </div>
  `,
  });
}
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
}
export async function sendForgotPasswordMail({
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
    subject: 'Reset Your Password',
    html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #fafafa;">
    <h2 style="color: #ff4081; text-align: center; margin-bottom: 20px;">Matcha</h2>
      <p style="font-size: 16px; line-height: 1.5; text-align: center;">
        We received a request to reset your password. Click the button below to change it:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a 
          href="http://localhost:5173/resetPassword?token=${token}" 
          style="display: inline-block; padding: 12px 24px; background-color: #ff4081; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;"
        >
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #777; text-align: center;">
        If you didn’t request this, you can safely ignore this email.
      </p>
      <p style="font-size: 14px; color: #777; text-align: center; margin-top: 40px;">
        — The Matcha Team
      </p>
    </div>
  `,
  });
}

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  console.log(`User ${userId} connected`);
  db.execute("UPDATE usersInfo SET isOnline = 1 WHERE id = ?", [userId]);

  io.emit("userStatus", { userId, isOnline: true, lastOnline: new Date().toISOString() });
  onlineUsers.set(userId, socket.id);


  socket.on("disconnect", async () => {
    const userId = socket.handshake.auth.userId;
    console.log(`User ${userId} disconnected`);
    await db.execute(
      "UPDATE usersInfo SET isOnline = 0, lastOnline = NOW() WHERE id = ?",
      [userId]
    );
    io.emit("userStatus", { userId, isOnline: false, lastOnline: new Date() });
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

async function startServer() {
  server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
  });
}

function getConversationsFromUser({
  targetUserId,
  conversationsFromDb,
}: {
  targetUserId: number;
  conversationsFromDb: MessageRequest[];
}) {
  const conversations: Message[] = [];
  for (let i = 0; i < conversationsFromDb.length; i++) {
    const conversationFromDb = conversationsFromDb[i];
    if (
      conversationFromDb['actor_user_id'] === targetUserId ||
      conversationFromDb['target_user_id'] === targetUserId
    ) {
      conversations.push(conversationFromDb.message);
    }
  }
  return conversations;
}
startServer();
