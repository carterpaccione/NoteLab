import express from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from '../models/user.js';

dotenv.config();
const router = express.Router();

// POST /auth/login - Login a user

router.post('/login', async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ where: { username: username } });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const passwordIsVaild = await bcrypt.compare(password, user.password);
    if (!passwordIsVaild) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    const token = jwt.sign({ username: username, id: user.id }, secretKey, { expiresIn: '1h' });
    console.log('Token: ', token, 'User: ', user);
    return res.json({ token });
});

// POST /auth/register - Register a new user

router.post('/register', async (req: Request, res: Response) => {
    console.log("POST /api/users");
    console.log("Request body: ", req.body);
    try {
        const user = await User.create({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        });
        return res.status(201).json({ data: user });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
})

export { router as authRoutes };