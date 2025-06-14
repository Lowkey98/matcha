import express from 'express';
import { connectDB } from './db';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { send } from 'process';
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

connectDB().then((db) => {
    const testCollection = db.collection('test');

    app.get('/api/ping', (_req, res) => {
        res.send({ msg: 'pong' });
    });

    app.get('/api/data', async (_req, res) => {
        try {
            const items = await testCollection.find().toArray();
            res.send(items);
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        }
    });

    app.post("/api/register", async (req, res) => {
        try {
            const { email, password, username } = req.body.registeredUser;
            const [emailExists, usernameExists] = await Promise.all([
                db.collection('userInfo').findOne({ email }),
                db.collection('userInfo').findOne({ username }),
            ]);

            if (emailExists || usernameExists) {
                res.status(400).json({
                    emailAlreadyExists: !!emailExists,
                    usernameAlreadyExists: !!usernameExists,
                });
            }
            console.log('email', email);
            console.log('password', password);
            const hashedPassword = await bcrypt.hash(password, 10);
            // create UIID token for email verification
            const verificationToken = require('crypto').randomUUID();
            await db.collection('userInfo').insertOne({
                email: email,
                password: hashedPassword,
                username: username,
                isVerified: false,
                createdAt: new Date(),
                verificationToken,
            });
            // sendVerificationEmail({ to: email, token: verificationToken });
            res.status(200).json({
                message: 'Registration successful. Please check your email to verify your account.',
            });
            // // Generate JWT token
            // const token = jwt.sign({ email: email }, 'secret');
            // res.status(200).json({ token });
        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });
    app.get("/api/verify", async (req, res) => {
        try {

            const { token } = req.query;
            if (!token) res.status(400).send("Missing token");
            console.log("token", token);
            const user = await db.collection("userInfo").findOne({ verificationToken: token });

            if (!user) res.status(400).send("Invalid or expired token");
            console.log("user", user);
            await db.collection("userInfo").updateOne(
                { _id: user?._id },
                // { $set: { isVerified: true } }
                { $set: { isVerified: true }, $unset: { verifyToken: "" } }
            )

            res.send("<h1>Email verified successfully!</h1>");
        }
        catch (err) {
            console.error('Verification error:', err);
            res.status(500).send('Internal server error.');
        }
    });

    app.listen(3000, () => {
        console.log('🚀 Server running at http://localhost:3000');
    });
});


export async function sendVerificationEmail({
    to,
    token,
}: {
    to: string;
    token: string;
}) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    console.log("process.env.EMAIL_USER", process.env.EMAIL_USER);
    console.log("process.env.EMAIL_PASS", process.env.EMAIL_PASS);

    const info = await transporter.sendMail({
        from: `"Matcha Team" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Confirm Your Matcha Account",
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


    console.log("Email sent:", info.messageId);
}