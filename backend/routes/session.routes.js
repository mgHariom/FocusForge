import {Router} from 'express';
import { getSession, addSession } from '../controllers/session.controller.js';
import authorize from '../middleware/auth.middleware.js';

const sessionRouter = Router();

sessionRouter.post('/', authorize, addSession);
sessionRouter.get('/', authorize, getSession);

export default sessionRouter;