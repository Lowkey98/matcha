import express from 'express';
import { connectDB } from './db';
import cors from 'cors';
import bcrypt from 'bcryptjs';

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
            const { email, password } = req.body.registeredUser;
            const alreadyExists = await db.collection('userInfo').findOne({
                email: email,
            });
            if (alreadyExists) {
                res.status(400).json({ error: 'User already exists.' });
            }
            console.log('email', email);
            console.log('password', password);
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.collection('userInfo').insertOne({
                email: email,
                password: hashedPassword,

                createdAt: new Date(),
            });
            res.status(201).json({ message: 'User registered successfully.' });
        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });

    app.listen(3000, () => {
        console.log('🚀 Server running at http://localhost:3000');
    });
});
