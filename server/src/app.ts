// server/src/app.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Existing Routes
import stockRoutes from './routes/stockRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import tradeRoutes from './routes/tradeRoutes';
// 👇 NEW: Portfolio Route Import kiya
import portfolioRoutes from './routes/portfolioRoutes';

import { setupSocket } from './sockets/marketSocket';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ 
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Fallback for dev
    credentials: true 
}));
app.use(helmet());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// --- ROUTES REGISTER ---
app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/trade', tradeRoutes);
// 👇 NEW: Portfolio Route Register kiya
app.use('/api/portfolio', portfolioRoutes);

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

setupSocket(io);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});