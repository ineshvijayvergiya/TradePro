// src/sockets/marketSocket.ts
import { Server, Socket } from 'socket.io';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Jab user kisi stock ko subscribe kare (e.g., RELIANCE page khola)
    socket.on('subscribe', (symbol: string) => {
      const roomName = `stock_${symbol}`;
      socket.join(roomName);
      console.log(`User joined room: ${roomName}`);

      // Start simulating price updates for this room
      simulateStockMovement(io, roomName, symbol);
    });

    socket.on('unsubscribe', (symbol: string) => {
      const roomName = `stock_${symbol}`;
      socket.leave(roomName);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

// Fake price movement generator (Real app mein yaha live stream hook hogi)
function simulateStockMovement(io: Server, room: string, symbol: string) {
  let basePrice = 2500.00; // Starting dummy price

  setInterval(() => {
    const change = (Math.random() - 0.5) * 5; // +/- 2.5 rupees
    basePrice += change;
    
    io.to(room).emit('price_update', {
      symbol: symbol,
      price: basePrice.toFixed(2),
      timestamp: new Date().toISOString()
    });
  }, 2000); // Har 2 second mein update
}