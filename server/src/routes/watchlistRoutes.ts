import { Router } from 'express';
import { createWatchlist, getWatchlists } from '../controllers/watchlistController';

const router = Router();

router.post('/', createWatchlist);
router.get('/:userId', getWatchlists);

export default router;