"use client";
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries, CrosshairMode } from 'lightweight-charts';

// Helper to calculate EMA
const calculateEMA = (data: any[], period: number) => {
  const k = 2 / (period + 1);
  let emaArray = [];
  let ema = data[0].close;

  for (let i = 0; i < data.length; i++) {
    const price = data[i].close;
    ema = price * k + ema * (1 - k);
    emaArray.push({ time: data[i].time, value: ema });
  }
  return emaArray;
};

interface ChartProps {
  data: any[];
  showEMA: boolean;
}

export const StockChart = ({ data, showEMA }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const ema20SeriesRef = useRef<any>(null);
  const ema50SeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Premium Chart Layout
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6B7280', // Gray-500
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' }, // Very subtle grid
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
            width: 1,
            color: 'rgba(255, 255, 255, 0.4)',
            style: 3, // Dashed
            labelBackgroundColor: '#22c55e',
        },
        horzLine: {
            color: 'rgba(255, 255, 255, 0.4)',
            labelBackgroundColor: '#22c55e',
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 380,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }
    });

    // 2. Add Candlestick Series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981', // Emerald 500
      downColor: '#ef4444', // Red 500
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // 3. Add EMA Series (Hidden by default logic handled in effect)
    const ema20Series = chart.addSeries(LineSeries, { color: '#3b82f6', lineWidth: 1, crosshairMarkerVisible: false }); // Blue
    const ema50Series = chart.addSeries(LineSeries, { color: '#f59e0b', lineWidth: 1, crosshairMarkerVisible: false }); // Amber

    candleSeries.setData(data);
    
    // Save refs
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    ema20SeriesRef.current = ema20Series;
    ema50SeriesRef.current = ema50Series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []); // Run once on mount

  // 4. Update Data & Indicators
  useEffect(() => {
    if (!candleSeriesRef.current || data.length === 0) return;

    candleSeriesRef.current.setData(data);

    if (showEMA) {
      const ema20Data = calculateEMA(data, 20);
      const ema50Data = calculateEMA(data, 50);
      
      ema20SeriesRef.current?.setData(ema20Data);
      ema50SeriesRef.current?.setData(ema50Data);
      
      // Make visible
      ema20SeriesRef.current?.applyOptions({ visible: true });
      ema50SeriesRef.current?.applyOptions({ visible: true });
    } else {
      // Hide
      ema20SeriesRef.current?.applyOptions({ visible: false });
      ema50SeriesRef.current?.applyOptions({ visible: false });
    }

  }, [data, showEMA]);

  return <div ref={chartContainerRef} className="w-full h-[380px]" />;
};