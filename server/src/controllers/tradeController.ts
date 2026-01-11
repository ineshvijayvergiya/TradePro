import { Request, Response } from 'express';
import { prisma } from '../config/db'; // Make sure path sahi ho

// Request Body ke liye Type define kiya
interface TradeRequest {
  userId: string;
  symbol: string;
  quantity: number;
  side: "BUY" | "SELL";
}

// Helper: Live Price Fetcher
const getLivePrice = async (symbol: string): Promise<number> => {
  const basePrices: Record<string, number> = { 
    "RELIANCE": 2450, 
    "TCS": 3800, 
    "HDFCBANK": 1650, 
    "INFY": 1500,
    "NVDA": 880,
    "BTC": 65000
  };
  const base = basePrices[symbol] || 1000;
  return parseFloat((base + (Math.random() * 20 - 10)).toFixed(2));
};

export const executeTrade = async (req: Request, res: Response) => {
  try {
    // Type casting kiya taaki TS ko pata chale data kya hai
    const { userId, symbol, quantity, side } = req.body as TradeRequest;

    if (!userId || !symbol || !quantity || !side) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const qty = Number(quantity);
    const currentPrice = await getLivePrice(symbol);
    const totalValue = qty * currentPrice;

    // --- BUY LOGIC ---
    if (side === "BUY") {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      
      if (!user || user.balance < totalValue) {
        return res.status(400).json({ 
            message: `Insufficient Balance! Need: ₹${totalValue.toFixed(2)}, Have: ₹${user?.balance.toFixed(2)}` 
        });
      }

      // Transaction
      await prisma.$transaction(async (tx) => {
        // 1. Deduct Balance
        await tx.user.update({
          where: { id: userId },
          data: { balance: { decrement: totalValue } }
        });

        // 2. Create Trade
        await tx.trade.create({
          data: { 
            userId, 
            symbol, 
            quantity: qty, 
            price: currentPrice, 
            side: "BUY" 
          }
        });

        // 3. Update Position
        const existingPos = await tx.position.findUnique({
          where: { userId_symbol: { userId, symbol } }
        });

        if (existingPos) {
          const newQty = existingPos.quantity + qty;
          const newAvg = ((existingPos.quantity * existingPos.avgPrice) + totalValue) / newQty;

          await tx.position.update({
            where: { id: existingPos.id },
            data: { quantity: newQty, avgPrice: newAvg }
          });
        } else {
          await tx.position.create({
            data: { userId, symbol, quantity: qty, avgPrice: currentPrice }
          });
        }
      });
    } 
    
    // --- SELL LOGIC ---
    else if (side === "SELL") {
      const existingPos = await prisma.position.findUnique({
        where: { userId_symbol: { userId, symbol } }
      });

      if (!existingPos || existingPos.quantity < qty) {
        return res.status(400).json({ message: `Not enough shares to sell. You have ${existingPos?.quantity || 0}` });
      }

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { balance: { increment: totalValue } }
        });

        await tx.trade.create({
          data: { 
            userId, 
            symbol, 
            quantity: qty, 
            price: currentPrice, 
            side: "SELL" 
          }
        });

        const newQty = existingPos.quantity - qty;
        
        if (newQty === 0) {
          await tx.position.delete({ where: { id: existingPos.id } });
        } else {
          await tx.position.update({
            where: { id: existingPos.id },
            data: { quantity: newQty }
          });
        }
      });
    }

    return res.json({ 
        success: true, 
        message: `Successfully ${side === 'BUY' ? 'Bought' : 'Sold'} ${symbol}`,
        price: currentPrice 
    });

  } catch (error) {
    console.error("Trade Error:", error);
    return res.status(500).json({ message: "Transaction Failed" });
  }
};