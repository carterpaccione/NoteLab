import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserToken {
    username: string;
    id: number;
    iat: number;
    exp: number;
}
export interface CustomRequest extends Request {
    user?: UserToken;
}

const authMethod = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No Token' });
        return;
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        res.status(500).json({ message: 'Internal server error: No Secret Key' });
        return;
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], secretKey) as UserToken;
        req.body.token = decoded;
        return next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid Token' });
        return;
    }
};

export default authMethod;