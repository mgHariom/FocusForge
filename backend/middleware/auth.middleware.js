import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

const authorize = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({message: 'no token provided'});
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        //attach user info to req.user
        req.user = {userid: decoded.userid};

        next()
    } catch (error) {
        return res.status(401).json({message: 'Invalid or expired token'});
    }
}

export default authorize;