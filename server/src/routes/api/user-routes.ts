import express from 'express';
import type { Response } from 'express';
import { User } from '../../models/user.js';
import { Notebook } from '../../models/notebook.js';

import { CustomRequest } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Logged In User Routes

// GET /api/users/me - Get the current user by token

router.get('/me', async (req: CustomRequest, res: Response) => {
    const reqUser = req.user;
    if (!reqUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({
            where: { id: reqUser.id },
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
        return res.status(200).json({ data: user });
    } catch (err) {
        return res.status(400).json({
            message: (err as Error).message
        });
    }
});

// DELETE /api/users/me - Delete the current user by token

router.delete('/me', async (req: CustomRequest, res: Response) => {
    const reqUser = req.user;
    if (!reqUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const deletedUser = await User.destroy({ where: { id: reqUser.id } });
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
})

// Admin (carter) Only Routes - For testing purposes only

// GET /api/users - Get all users

router.get('/', async (req: CustomRequest, res: Response) => {

    // So only the user with the username 'carter' can access this route for test purposes
    console.log("GET /api/users");
    const reqUser = req.user;
    if (!reqUser || reqUser.username !== 'carter') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

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

router.get('/:id', async (req: CustomRequest, res: Response) => {

    // So only the user with the username 'carter' can access this route for test purposes
    console.log("GET /api/users");
    const reqUser = req.user;
    if (!reqUser || reqUser.username !== 'carter') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

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

// DELETE /api/users - Delete a user by ID

router.delete('/:id', async (req: CustomRequest, res: Response) => {
    const reqUser = req.user;
    if (!reqUser || reqUser.username !== 'carter') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

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