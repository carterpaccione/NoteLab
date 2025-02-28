import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../../db/connection.js';
import type { QueryResult } from 'pg';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', async (_req: Request, res: Response) => {
    const sql = `SELECT * FROM users`;

    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(400).json({
                message: err.message
            });
            return;
        }
        res.json({
            data: result.rows
        });
    })
});

// GET /api/users/:id - Get a user by ID
router.get('/:id', async (req: Request, res: Response) => {
    const userSQL = `SELECT * FROM users WHERE id = $1`;
    const notebooksSQL = `SELECT * FROM notebooks WHERE user_id = $1`;
    // const notesSQL = `SELECT * FROM notes WHERE notebook_id = $1`;
    const params = [req.params.id];

    try {
        const userResult = await pool.query(userSQL, params);
        const notebooksResult = await pool.query(notebooksSQL, params);
        res.json({
            data: {
                user: {
                    ...userResult.rows[0],
                    notebooks: notebooksResult.rows
                }
            }
        });
    } catch (err) {
        res.status(400).json({
            message: (err as Error).message,
            params: params
        });
    }
})

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const sql = `INSERT INTO users (email, username, password) VALUES ($1, $2, $3)`;
    const params = [req.body.email, req.body.username, hashedPassword];

    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(400).json({
                message: err.message,
                params: params
            });
            return;
        }
        res.json({
            message: 'User created',
            data: result.rows[0]
        })
    })
});

// DELETE /api/users - Delete a user by ID
router.delete('/:id', async (req: Request, res: Response) => {
    const sql = `DELETE FROM users WHERE id = $1`;
    const params = [req.params.id];

    pool.query(sql, params, (err: Error, _result: QueryResult) => {
        if (err) {
            res.status(400).json({
                message: err.message,
                params: params
            });
            return;
        }
        res.json({
            message: 'User deleted'
        })
    })
})

export { router as userRouter };