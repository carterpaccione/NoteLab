import express from 'express';
import { getHint } from '../../controllers/hintContoller.js';
import { getSummary } from '../../controllers/summaryController.js';

const router = express.Router();

router.post('/hint', getHint);
router.post('/summary', getSummary);

export { router as openAIRouter };