import express from 'express';
//import { storeHistory } from '../controllers/historyController';
import {
  generateStrategy,
  generatePracticeProblems,
} from '../controllers/openaiController.js';
import { parseUserQuery} from '../controllers/parseUserQuery.js';
import { storeHistory, getHistory, getTitle} from '../controllers/historyController.js';

const router = express.Router();

// Generate initial strategy
router.post('/generate', parseUserQuery, async (req, res) => {
  try {
    await generateStrategy(req, res, () => {});
    res.json(res.locals.generatedResponse);
  } catch (error) {
    console.error('Error in generate strategy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate practice problems in a separate endpoint
router.post('/practice-problems', parseUserQuery, async (req, res) => {
  try {
    await generatePracticeProblems(req, res, () => {});
    res.json(res.locals.practiceProblems);
  } catch (error) {
    console.error('Error in generate practice problems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Store history in a separate endpoint

router.post('/storeHistory', storeHistory);

router.get('/getHistory', getHistory);

router.get('/matchTitle/:title', getTitle);

export default router;
