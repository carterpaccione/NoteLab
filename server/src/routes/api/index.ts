import { Router } from 'express';
import { userRouter } from './user-routes.js';
import { notebookRouter } from './notebook-routes.js';
import { noteRouter } from './note-routes.js';
import { openAIRouter } from './openai-routes.js';

import authMethod from '../../middleware/authMiddleware.js';

const router = Router();

router.use('/users', authMethod, userRouter);
router.use('/notebooks', authMethod, notebookRouter);
router.use('/notes', authMethod, noteRouter);
router.use('/openai', openAIRouter);

export default router;