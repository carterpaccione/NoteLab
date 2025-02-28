import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db/connection.js';
import type { QueryResult } from 'pg';

import dotenv from 'dotenv';
dotenv.config();

export const login = async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log("REQUEST BODY: ", req.body);
   
    const sql = `SELECT username, email, id, password FROM users WHERE username = $1`;
    const params = [username];

    pool.query(sql, params, async (err: Error, result: QueryResult) => {
        if(err) {
            res.status(400).json({ message: err.message });
            return;
        }

        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("USER: ", user);
        const passwordIsVaild = await bcrypt.compare(password, user.password);
        if (!passwordIsVaild) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

        return res.json({ token: token, userData: user });
    });
};

const router = Router();

router.post('/login', login);

export default router;