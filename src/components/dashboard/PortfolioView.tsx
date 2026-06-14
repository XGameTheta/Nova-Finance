import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketWatch } from "./MarketWatch";

/* Mock Portfolio Data */
const portfolioData = [
  { date: "Jan", balance: 10000 },
  { date: "Feb", balance: 10500 },
  { date: "Mar", balance: 10200 },
  { date: "Apr", balance: 11800 },
  { date: "May", balance: 11600 },
  { date: "Jun", balance: 12400 },
  { date: "Jul", balance: 12900 },
  { date: "Aug", balance: 13500 },
  { date: "Sep", balance: 13100 },
  { date: "Oct", balance: 14200 },
  { date: "Nov", balance: 15400 },
  { date: "Dec", balance: 16200 },
];

export function PortfolioView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Portfolio Overview</h2>
        <p className="text-muted-foreground mt-1">Track your investments and derivatives hedging.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:border-blue-500/50 transition-colors glow-green">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase tracking-wider text-[10px] text-slate-400 font-mono">Net Liquidity</CardDescription>
            <CardTitle className="text-4xl font-bold font-mono">$16,200.00</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Badge variant="outline" className="text-green-400 bg-green-500/10 border-none font-bold">+62.0% YTD</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="uppercase tracking-wider text-[10px] text-slate-400 font-mono">Day P&L</CardDescription>
            <CardTitle className="text-4xl font-bold font-mono text-green-400">+$240.50</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400 font-mono">
               Driven by AAPL Covered Calls
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="uppercase tracking-wider text-[10px] text-slate-400 font-mono">Hedging Ratio</CardDescription>
            <CardTitle className="text-4xl font-bold font-mono text-blue-400">15.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400 font-mono">
              SPY Puts & VIX Calls
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3 border-border">
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
          <CardDescription>1-Year Performance (Including Options Premiums)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  fontFamily="JetBrains Mono"
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontFamily: 'JetBrains Mono' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
                <Area type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <MarketWatch />
    </div>
  );
}
