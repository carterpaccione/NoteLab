import express from 'express';
import type { Request, Response } from 'express';
import { pool } from '../../db/connection.js';
import type { QueryResult } from 'pg';

const router = express.Router();

// POST /api/notes - Create a new note
router.post('/', async (req: Request, res: Response) => {
    const content = req.body.content;
    const notebookId = req.body.notebook_id;
    const importance = req.body.importance;
    let sql;
    let params;

    if(!content || !notebookId) {
        res.status(400).json({ message: 'Content and notebook ID are required' });
        return;
    } else if(!importance) {
        sql = `INSERT INTO notes (content, notebook_id) VALUES ($1, $2)`
        params = [content, notebookId]
    } else { 
        sql = `INSERT INTO notes (content, notebook_id, importance) VALUES ($1, $2, $3)`
        params = [content, notebookId, importance]
    }

    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        }
        res.json({
            message: 'Note created',
            data: result.rows[0]
        });
    });
});

// PUT /api/notes/:id - Update a note by ID
router.put('/:id', async (req: Request, res: Response) => {
    const newContent = req.body.content;
    const newImportance = req.body.importance;
    const notebookId = req.params.id;
    let sql;
    let params;

    if (!newImportance) {
        sql = `
        UPDATE notes
        SET content = $1
        WHERE id = $2
        RETURNING id, content, importance
        `;
        params = [newContent, notebookId]
    } else if (!newContent) {
        sql = `
        UPDATE notes
        SET importance = $1
        WHERE id = $2
        RETURNING id, content, importance
        `;
        params = [newImportance, notebookId]
    } else {
        sql = `
        UPDATE notes
        SET content = $1, importance = $2
        WHERE id = $3
        RETURNING id, content, importance
        `;
        params = [newContent, newImportance, notebookId]
    }

    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        } else if (!result.rowCount) {
            res.json({
                message: 'Note not found'
            });
        }
        res.json({
            message: 'Note updated',
            data: result.rows[0],
            rowsAffected: result.rowCount
        });
    });
});

// DELETE /api/notes/:id - Delete a note by ID
router.delete('/:id', async (req: Request, res: Response) => {
    const sql = `DELETE FROM notes WHERE id = $1`;

    const params = [req.params.id];

    pool.query(sql, params, (err: Error, _result: QueryResult) => {
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        }
        res.json({
            message: 'Note deleted'
        });
    });
});

export { router as noteRouter };