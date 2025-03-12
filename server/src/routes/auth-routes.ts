import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import { User } from '../models/user.js';
dotenv.config();

export const login = async (req: Request, res: Response) => {
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
};

const router = Router();

router.post('/login', login);

export default router;