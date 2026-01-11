// src/controllers/stockController.ts
import { Request, Response, NextFunction } from 'express';
import { getQuote } from '../services/finnhub';
import { prisma } from '../config/db';

// Get Stock Price
export const getStockPrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol } = req.params;
    const data = await getQuote(symbol as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Get AI Insight (Mocked for now to save API credits, logic ready)
export const getStockInsight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol } = req.params;

    // Check DB for recent cached insight
    const cachedInsight = await prisma.aIInsight.findFirst({
      where: { symbol: symbol as string },
      orderBy: { timestamp: 'desc' }
    });

    if (cachedInsight) {
      return res.json(cachedInsight);
    }

    // Agar DB mein nahi hai, toh new create karo (Mock logic for demo)
    const newInsight = await prisma.aIInsight.create({
      data: {
        symbol: symbol as string,
        sentiment: "Positive",
        riskLevel: "Medium",
        summary: `AI analysis shows strong momentum for ${symbol} based on recent technical indicators.`
      }
    });

    res.json(newInsight);
  } catch (error) {
    next(error);
  }
};