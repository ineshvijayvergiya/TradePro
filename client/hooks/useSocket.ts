import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (symbol: string) => {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.emit('subscribe', symbol);
    socket.on('price_update', (data) => {
      if (data.symbol === symbol) setPrice(parseFloat(data.price));
    });
    return () => { socket.disconnect(); };
  }, [symbol]);

  return price;
};