import express from 'express';
import type { Request, Response } from 'express';
import { Notebook } from '../../models/notebook.js';
import { Note } from '../../models/note.js';

const router = express.Router();

// GET /api/notebooks/:id - Get a notebook by ID

router.get('/:id', async (req: Request, res: Response) => {
    const reqUser = req.body.token;
    if (!reqUser) {
        return res.status(401).json({ message: 'Not Logged In' });
    }
    try {
        const notebook = await Notebook.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Note,
                    attributes: ['id', 'content', 'importance', 'createdAt']
                }
            ],
            order: [[Note, 'createdAt', 'ASC']]
        });
        if (notebook) {
            if (notebook.user_id !== reqUser.id) {
                return res.status(403).json({ message: 'Unauthorized: ids dont match' });
            }
            return res.status(200).json({ data: notebook });
        }
        return res.status(404).json({ message: 'Notebook not found' });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

// POST /api/notebooks - Create a new notebook

router.post('/', async (req: Request, res: Response) => {
    const reqUser = req.body.token;
    if (!reqUser) {
        return res.status(401).json({ message: 'Not Logged In' });
    }
    try {
        const notebook = await Notebook.create({
            title: req.body.title,
            user_id: reqUser.id,
        });
        return res.status(201).json({ data: notebook });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

// PUT /api/notebooks/:id - Update a notebook title by ID

router.put('/:id', async (req: Request, res: Response) => {
    const reqUser = req.body.token;
    if (!reqUser) {
        return res.status(401).json({ message: 'Not Logged In' });
    }
    try {
        const notebook = await Notebook.findByPk(req.params.id);
        if (notebook) {
            if (notebook.user_id !== reqUser.id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            notebook.title = req.body.title;
            await notebook.save();
            return res.status(200).json({ data: notebook });
        }
        return res.status(404).json({ message: 'Notebook not found' });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

// DELETE /api/notebooks/:id - Delete a notebook by ID

router.delete('/:id', async (req: Request, res: Response) => {
    const reqUser = req.body.token;
    if (!reqUser) {
        return res.status(401).json({ message: 'Not Logged In' });
    }

    try {
        const deletedNotebook = await Notebook.destroy({ where: { id: req.params.id, user_id: reqUser.id } });
        if (deletedNotebook) {
            return res.status(200).json({ message: 'Notebook Deleted', deletedNotebookId: req.params.id });
        }
        return res.status(404).json({ message: 'Notebook not found' });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

export { router as notebookRouter };