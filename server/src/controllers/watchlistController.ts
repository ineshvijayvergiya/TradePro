import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

// Create Watchlist
export const createWatchlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, userId } = req.body;
    const watchlist = await prisma.watchlist.create({
      data: { name, userId }
    });
    res.json(watchlist);
  } catch (error) {
    next(error);
  }
};

// Get User Watchlists
export const getWatchlists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const watchlists = await prisma.watchlist.findMany({
      // Yahan maine String(userId) laga diya taaki TypeScript khush rahe
      where: { userId: String(userId) },
      // include: { items: true } // Abhi items table shayad khali ho, toh error na de isliye comment kar sakte ho, par rehne do toh bhi chalega
    });
    
    res.json(watchlists);
  } catch (error) {
    next(error);
  }
};