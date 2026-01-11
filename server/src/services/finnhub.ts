// src/services/finnhub.ts
import axios from 'axios';

const BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINNHUB_API_KEY;

export const getQuote = async (symbol: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol: symbol.toUpperCase(),
        token: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw new Error('Failed to fetch stock data');
  }
};