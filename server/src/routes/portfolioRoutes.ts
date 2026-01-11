import { Router } from 'express';
import { getPortfolio } from '../controllers/portfolioController';

const router = Router();

// GET /api/portfolio
router.get('/', getPortfolio);

export default router;