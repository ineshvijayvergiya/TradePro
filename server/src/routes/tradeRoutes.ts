import { Router } from 'express';
import { executeTrade } from '../controllers/tradeController';

const router = Router();

// POST /api/trade
// Ye route ab smart hai -> Body me { side: "BUY" } ya { side: "SELL" } bhejo, ye handle karega.
router.post('/', executeTrade); 

// Note: Portfolio wala route humne 'portfolioRoutes.ts' me shift kar diya hai 
// taaki code clean rahe aur controller se match kare.

export default router;