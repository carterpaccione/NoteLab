import express from 'express';
import type { Request, Response } from 'express';
import { User } from '../../models/user.js';
import { Notebook } from '../../models/notebook.js';

const router = express.Router();

// GET /api/users - Get all users

router.get('/', async (_req: Request, res: Response) => {
    console.log("GET /api/users");
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'username'],
        });
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        return res.status(200).json({ data: users });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

// GET /api/users/:id - Get a user by ID

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Notebook,
                    attributes: ['id', 'title', 'createdAt'],
                }
            ],
            order: [
                [Notebook, 'createdAt', 'ASC']
            ]
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("User found: ", user);
        return res.status(200).json({ data: user });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

// POST /api/users - Create a new user

router.post('/', async (req: Request, res: Response) => {
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
});

// DELETE /api/users - Delete a user by ID

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.destroy({ where: { id: req.params.id } });
        if (deletedUser) {
            return res.status(200).json({
                message: 'User deleted',
                deletedUser: deletedUser
            });
        }
        return res.status(404).json({ message: 'User not found' });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

export { router as userRouter };