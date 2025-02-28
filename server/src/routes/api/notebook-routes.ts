import express from 'express';
import type { Request, Response } from 'express';
import { pool } from '../../db/connection.js';
import type { QueryResult } from 'pg';

const router = express.Router();

// GET /api/:id - Get a notebook by ID
router.get('/:id', async (req: Request, res: Response) => {
    const notebookSQL = `SELECT * FROM notebooks WHERE id = $1`;
    const notesSQL = `SELECT * FROM notes WHERE notebook_id = $1`;
    const params = [req.params.id];

    try {
        const notebookResult = await pool.query(notebookSQL, params);
        const notesResult = await pool.query(notesSQL, params);
        res.json({
            data: {
                notebook: {
                    ...notebookResult.rows[0],
                    notes: notesResult.rows
                }
            }
        })
    } catch (err) {
        res.status(400).json({
            message: (err as Error).message,
            params: params
        });
    }
});

// POST /api/notebooks - Create a new notebook
router.post('/', async (req: Request, res: Response) => {
    const sql = `INSERT INTO notebooks (title, user_id) VALUES ($1, $2) RETURNING *`;
    const params = [req.body.title, req.body.user_id];

    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        }
        res.json({
            message: 'Notebook created',
            data: result.rows[0]
        })
    });
});

// PUT /api/notebooks/:id - Update a notebook title by ID
router.put('/:id', async (req: Request, res: Response) => {
    const sql = `UPDATE notebooks SET title = $1 WHERE id = $2 RETURNING *`;
    const params = [req.body.title, req.params.id];

    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        } else if (!result.rowCount) {
            res.json({
                message: 'Notebook not found'
            });
        }
        res.json({
            message: 'Notebook Title Updated',
            data: result.rows[0]
        })
    });
});

// DELETE /api/notebooks/:id - Delete a notebook by ID
router.delete('/:id', async (req: Request, res: Response) => {
    const sql = `DELETE FROM notebooks WHERE id = $1`;
    const params = [req.params.id];

    pool.query(sql, params, (err: Error, _result: QueryResult) => {
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        }
        res.json({
            message: 'Notebook Deleted'
        })
    });
});

export { router as notebookRouter };