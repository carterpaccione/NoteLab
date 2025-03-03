import express from 'express';
import type { Request, Response } from 'express';
import { Notebook } from '../../models/notebook.js';
import { Note } from '../../models/note.js';

const router = express.Router();

// GET /api/:id - Get a notebook by ID

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const notebook = await Notebook.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Note,
                    attributes: ['id', 'content', 'importance']
                }
            ]
        });
        if (notebook) {
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
    try {
        const notebook = await Notebook.create({
            title: req.body.title,
            user_id: req.body.user_id,
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
    try {
        const notebook = await Notebook.findByPk(req.params.id);
        if (notebook) {
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
    try {
        const deletedNotebook = await Notebook.destroy({ where: { id: req.params.id } });
        if (deletedNotebook) {
            return res.status(200).json({ message: 'Notebook Deleted', detedNotebook: deletedNotebook });
        }
        return res.status(404).json({ message: 'Notebook not found' });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

export { router as notebookRouter };