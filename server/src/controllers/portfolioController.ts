import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getLivePrice = async (symbol: string) => {
  const basePrices: any = { "RELIANCE": 2450, "TCS": 3800, "HDFCBANK": 1650 };
  const base = basePrices[symbol] || 1000;
  return parseFloat((base + (Math.random() * 20 - 10)).toFixed(2));
};

export const getPortfolio = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: "User ID required" });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { portfolio: true }
    });

    // Demo user creation if not exists (Testing ke liye)
    if (!user) {
      user = await prisma.user.create({
        data: { id: userId, email: `demo_${userId}@trade.com` },
        include: { portfolio: true } // Include portfolio here too
      });
    }
    
    // Check if portfolio exists (it might be empty array, which is fine)
    const portfolioItems = user.portfolio || [];

    const holdings = await Promise.all(portfolioItems.map(async (pos) => {
      const ltp = await getLivePrice(pos.symbol);
      const currentValue = pos.quantity * ltp;
      const investedValue = pos.quantity * pos.avgPrice;
      const pnl = currentValue - investedValue;

      return {
        id: pos.id,
        symbol: pos.symbol,
        quantity: pos.quantity,
        avgPrice: pos.avgPrice,
        ltp,
        currentValue,
        pnl,
        pnlPercent: (pnl / investedValue) * 100,
        isProfit: pnl >= 0
      };
    }));

    const totalCurrentValue = holdings.reduce((acc, curr) => acc + curr.currentValue, 0);
    const totalInvested = holdings.reduce((acc, curr) => acc + (curr.quantity * curr.avgPrice), 0);

    res.json({
      balance: user.balance,
      totalInvested,
      totalCurrentValue,
      totalPnL: totalCurrentValue - totalInvested,
      holdings
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};