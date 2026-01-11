// src/routes/stockRoutes.ts
import { Router } from 'express';
import { getStockPrice, getStockInsight } from '../controllers/stockController';

const router = Router();

// Route: /api/stocks/:symbol
router.get('/:symbol', getStockPrice);

// Route: /api/stocks/:symbol/insight
router.get('/:symbol/insight', getStockInsight);

export default router;