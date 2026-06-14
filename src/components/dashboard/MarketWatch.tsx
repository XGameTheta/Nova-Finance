import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  lastUpdate: Date;
  flashStatus: "up" | "down" | null;
}

const INITIAL_INDICES: IndexData[] = [
  { symbol: "SPX", name: "S&P 500 Index", price: 5120.50, change: 12.45, changePercent: 0.24, high: 5142.10, low: 5105.30, lastUpdate: new Date(), flashStatus: null },
  { symbol: "NDX", name: "Nasdaq 100", price: 18220.15, change: -48.20, changePercent: -0.26, high: 18310.40, low: 18180.95, lastUpdate: new Date(), flashStatus: null },
  { symbol: "DJI", name: "Dow Jones Industrial Average", price: 39110.80, change: 188.50, changePercent: 0.48, high: 39190.20, low: 38980.50, lastUpdate: new Date(), flashStatus: null },
  { symbol: "RUT", name: "Russell 2000", price: 2045.25, change: 8.10, changePercent: 0.40, high: 2055.80, low: 2038.15, lastUpdate: new Date(), flashStatus: null },
  { symbol: "VIX", name: "CBOE Volatility Index", price: 13.42, change: -0.38, changePercent: -2.75, high: 14.15, low: 13.20, lastUpdate: new Date(), flashStatus: null },
];

export function MarketWatch() {
  const [indices, setIndices] = useState<IndexData[]>(INITIAL_INDICES);
  const [isAutoUpdating, setIsAutoUpdating] = useState(true);

  useEffect(() => {
    if (!isAutoUpdating) return;

    const interval = setInterval(() => {
      setIndices((prevIndices) =>
        prevIndices.map((idx) => {
          // Calculate realistic price tick fluctuation
          const volatility = idx.symbol === "VIX" ? 0.08 : 0.015; // raw index weight volatility
          const baseTickPercent = (Math.random() - 0.49) * volatility; // slight positive bias
          const priceChange = idx.price * baseTickPercent;
          const newPrice = Number((idx.price + priceChange).toFixed(2));
          const netChange = Number((idx.change + priceChange).toFixed(2));
          const netPercent = Number(((netChange / (idx.price - netChange)) * 100).toFixed(2));

          const flash: "up" | "down" = priceChange >= 0 ? "up" : "down";

          return {
            ...idx,
            price: newPrice,
            change: netChange,
            changePercent: netPercent,
            high: newPrice > idx.high ? newPrice : idx.high,
            low: newPrice < idx.low ? newPrice : idx.low,
            lastUpdate: new Date(),
            flashStatus: flash,
          };
        })
      );

      // Clear the flash highlights quickly for interactive ticking experience
      const timer = setTimeout(() => {
        setIndices((prev) => prev.map((idx) => ({ ...idx, flashStatus: null })));
      }, 800);

      return () => clearTimeout(timer);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoUpdating]);

  const forceManualRefresh = () => {
    // Cause a tiny randomized update immediately to simulate API action
    setIndices((prevIndices) =>
      prevIndices.map((idx) => {
        const delta = (Math.random() - 0.5) * (idx.symbol === "VIX" ? 0.5 : 5);
        const newPrice = Number((idx.price + delta).toFixed(2));
        const netChange = Number((idx.change + delta).toFixed(2));
        const netPercent = Number(((netChange / (idx.price - netChange)) * 100).toFixed(2));
        return {
          ...idx,
          price: newPrice,
          change: netChange,
          changePercent: netPercent,
          lastUpdate: new Date(),
          flashStatus: delta >= 0 ? "up" : "down",
        };
      })
    );
    setTimeout(() => {
      setIndices((prev) => prev.map((idx) => ({ ...idx, flashStatus: null })));
    }, 800);
  };

  return (
    <Card className="border-white/5 bg-slate-900/40 glow-blue overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold text-blue-400 font-mono tracking-tight flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            MARKET WATCH
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
            LIVE DERIVATIVE UNDERLYING TICKERS
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoUpdating(!isAutoUpdating)}
            className={`px-3 py-1 text-xs rounded-full border transition-all font-mono tracking-wider ${
              isAutoUpdating
                ? "bg-green-500/15 border-green-500/30 text-green-400"
                : "bg-slate-800/80 border-white/5 text-slate-400"
            }`}
          >
            {isAutoUpdating ? "● LIVE FEED" : "|| PAUSED"}
          </button>
          <button
            onClick={forceManualRefresh}
            className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            title="Force Ticker Update"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="border-white/5 bg-slate-950/30">
            <TableRow className="border-white/5">
              <TableHead className="font-mono text-[10px] text-slate-400 tracking-wider uppercase p-4">Index</TableHead>
              <TableHead className="font-mono text-[10px] text-slate-400 tracking-wider uppercase p-4">Ticker</TableHead>
              <TableHead className="font-mono text-[10px] text-slate-400 tracking-wider uppercase p-4 text-right">Last Price</TableHead>
              <TableHead className="font-mono text-[10px] text-slate-400 tracking-wider uppercase p-4 text-right">Change</TableHead>
              <TableHead className="font-mono text-[10px] text-slate-400 tracking-wider uppercase p-4 text-right">Day Range</TableHead>
              <TableHead className="font-mono text-[10px] text-slate-400 tracking-wider uppercase p-4 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {indices.map((idx) => {
              const isPositive = idx.change >= 0;
              const flashClass =
                idx.flashStatus === "up"
                  ? "bg-green-500/20 transition-all duration-150"
                  : idx.flashStatus === "down"
                  ? "bg-red-500/20 transition-all duration-150"
                  : "transition-colors duration-1000";

              return (
                <TableRow
                  key={idx.symbol}
                  className={`border-b border-white/5 hover:bg-white/5 ${flashClass}`}
                >
                  <TableCell className="p-4 font-normal text-slate-300">
                    {idx.name}
                  </TableCell>
                  <TableCell className="p-4 font-bold font-mono text-blue-400">
                    {idx.symbol}
                  </TableCell>
                  <TableCell className="p-4 text-right font-mono font-medium text-slate-200">
                    ${idx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={`p-4 text-right font-mono font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                    <span className="flex items-center justify-end gap-1">
                      {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {isPositive ? "+" : ""}
                      {idx.changePercent}%
                    </span>
                  </TableCell>
                  <TableCell className="p-4 text-right font-mono text-xs text-slate-500">
                    ${idx.low.toFixed(1)} - ${idx.high.toFixed(1)}
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <Badge
                      className={`text-[9px] border-none font-bold uppercase ${
                        isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {isPositive ? "Bullish" : "Bearish"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
