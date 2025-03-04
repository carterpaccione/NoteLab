import { Router } from 'express';
import { userRouter } from './user-routes.js';
import { notebookRouter } from './notebook-routes.js';
import { noteRouter } from './note-routes.js';
import { openAIRouter } from './openai-routes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/notebooks', notebookRouter);
router.use('/notes', noteRouter);
router.use('/openai', openAIRouter);

export default router;