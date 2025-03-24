import express from 'express';
import type { Request, Response } from 'express';
import { Note } from '../../models/note.js';

const router = express.Router();

// POST /api/notes - Create a new note

router.post('/', async (req: Request, res: Response) => {
    const reqUser = req.body.token;
    if (!reqUser) {
        return res.status(401).json({ message: 'Unauthorized: no Req' });
    }
    console.log(req.body);
    try {
        const note = await Note.create({
            content: req.body.content,
            notebook_id: req.body.notebook_id,
            importance: req.body.importance,
            user_id: reqUser.id
        })
        return res.status(201).json({ data: note });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

// PUT /api/notes/:id - Update a note by ID

router.put('/:id', async (req: Request, res: Response) => {
    const reqUser = req.body.token;
    if (!reqUser) {
        return res.status(401).json({ message: 'Unauthorized: no Req' });
    }
    try {
        const note = await Note.findByPk(req.params.id);
        if (note) {
            if (req.body.content) {
                note.content = req.body.content;
            }
            if (req.body.importance) {
                note.importance = req.body.importance;
            }
            await note.save();
            return res.status(200).json({ data: note });
        }
        return res.status(404).json({ message: 'Note not found' });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

// DELETE /api/notes/:id - Delete a note by ID

router.delete('/:id', async (req: Request, res: Response) => {
    const reqUser = req.body.token;
    if (!reqUser) {
        return res.status(401).json({ message: 'Unauthorized: no Req' });
    }
    try {
        const deletedNote = await Note.destroy({ where: { id: req.params.id } });
        if (deletedNote > 0) { // > 0 because destroy() returns the number of rows deleted
            return res.status(200).json({ message: 'Note Deleted', deletedNoteId: req.params.id });
        }
        return res.status(404).json({ message: 'Note not found' });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

export { router as noteRouter };