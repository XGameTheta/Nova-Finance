import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Calculator, Target, DollarSign, ArrowUpRight, ArrowDownRight, ShieldAlert } from "lucide-react";

export function OptionsSimulator() {
  const [underlyingPrice, setUnderlyingPrice] = useState(150);
  const [strikePrice, setStrikePrice] = useState(155);
  const [premium, setPremium] = useState(3.50);
  const [contracts, setContracts] = useState(1);
  const [targetPrice, setTargetPrice] = useState(165);
  const [optionType, setOptionType] = useState<"Call" | "Put">("Call");
  const [positionType, setPositionType] = useState<"Long" | "Short">("Long");

  // Calculations
  const shares = contracts * 100;
  const totalCost = Number((premium * shares).toFixed(2));
  
  // Break-even
  const breakEven = optionType === "Call" ? strikePrice + premium : strikePrice - premium;

  // Payoff at target price
  const intrinsicAtTarget = optionType === "Call" 
    ? Math.max(0, targetPrice - strikePrice) 
    : Math.max(0, strikePrice - targetPrice);
  
  const pnlPerShareAtTarget = positionType === "Long" ? intrinsicAtTarget - premium : premium - intrinsicAtTarget;
  const totalPnlAtTarget = Number((pnlPerShareAtTarget * shares).toFixed(2));
  const returnOnRiskPercent = totalCost > 0 ? Number(((totalPnlAtTarget / totalCost) * 100).toFixed(1)) : 0;

  // Max Profit / Max Loss
  let maxProfitText = "";
  let maxLossText = "";

  if (positionType === "Long") {
    maxLossText = `-$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    if (optionType === "Call") {
      maxProfitText = "Unlimited";
    } else {
      const maxP = (strikePrice - premium) * shares;
      maxProfitText = `$${maxP.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }
  } else {
    maxProfitText = `$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    if (optionType === "Call") {
      maxLossText = "Unlimited";
    } else {
      const maxL = (strikePrice - premium) * shares;
      maxLossText = `-$${maxL.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }
  }

  // Generate generic payoff data for chart
  const generatePayoffData = () => {
    let data = [];
    const minP = Math.max(1, Math.floor(strikePrice - 30));
    const maxP = Math.ceil(strikePrice + 30);
    
    for (let price = minP; price <= maxP; price += 1) {
      let payoff = 0;
      if (optionType === "Call") {
        payoff = Math.max(0, price - strikePrice);
      } else {
        payoff = Math.max(0, strikePrice - price);
      }
      
      let pnl = positionType === "Long" ? payoff - premium : premium - payoff;
      
      data.push({
        price,
        pnl: Number((pnl * shares).toFixed(2)),
      });
    }
    return data;
  };

  const chartData = generatePayoffData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Derivatives Sandbox</h2>
        <p className="text-muted-foreground mt-1">Visualize strategies, simulate payoffs, and evaluate options trade parameters.</p>
      </div>

      {/* Options Trade Calculator Tool */}
      <Card className="border-blue-500/20 bg-slate-900/60 shadow-[0_0_20px_rgba(37,99,235,0.08)]">
        <CardHeader className="pb-4 border-b border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-mono tracking-tight text-blue-400">OPTIONS TRADE CALCULATOR</CardTitle>
                <CardDescription className="text-xs text-slate-400">Calculate break-even points, trade capital required, and potential payoff.</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 font-mono w-fit">
              {positionType} {optionType} Trade
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Position Selector */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">Action</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => setPositionType("Long")}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-all ${
                    positionType === "Long"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Buy (Long)
                </button>
                <button
                  type="button"
                  onClick={() => setPositionType("Short")}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-all ${
                    positionType === "Short"
                      ? "bg-purple-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sell (Short)
                </button>
              </div>
            </div>

            {/* Option Type Selector */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">Option Type</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => setOptionType("Call")}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-all ${
                    optionType === "Call"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Call
                </button>
                <button
                  type="button"
                  onClick={() => setOptionType("Put")}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-all ${
                    optionType === "Put"
                      ? "bg-amber-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Put
                </button>
              </div>
            </div>

            {/* Strike Price */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">Strike Price ($)</label>
              <Input
                type="number"
                step="0.5"
                min="1"
                value={strikePrice}
                onChange={(e) => setStrikePrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="bg-slate-950 border-white/10 font-mono text-slate-100"
              />
            </div>

            {/* Option Premium / Cost */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">Cost / Premium ($)</label>
              <Input
                type="number"
                step="0.05"
                min="0.01"
                value={premium}
                onChange={(e) => setPremium(Math.max(0.01, parseFloat(e.target.value) || 0))}
                className="bg-slate-950 border-white/10 font-mono text-slate-100"
              />
            </div>

            {/* Contracts */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">Contracts (×100)</label>
              <Input
                type="number"
                step="1"
                min="1"
                value={contracts}
                onChange={(e) => setContracts(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-slate-950 border-white/10 font-mono text-slate-100"
              />
            </div>

            {/* Target Price */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">Target Price ($)</label>
              <Input
                type="number"
                step="0.5"
                min="1"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="bg-slate-950 border-white/10 font-mono text-slate-100"
              />
            </div>
          </div>

          {/* Calculator Output Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Total Cost */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{positionType === "Long" ? "TOTAL COST / CAPITAL" : "PREMIUM COLLECTED"}</span>
                <DollarSign className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <p className="text-xl font-bold font-mono text-white">
                ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {contracts} contract{contracts > 1 ? "s" : ""} ({shares} shares)
              </p>
            </div>

            {/* Break-Even Point */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>BREAK-EVEN PRICE</span>
                <Target className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <p className="text-xl font-bold font-mono text-amber-400">
                ${breakEven.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {optionType === "Call" ? `Strike ($${strikePrice}) + Premium ($${premium})` : `Strike ($${strikePrice}) - Premium ($${premium})`}
              </p>
            </div>

            {/* Max Risk / Reward */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>MAX PROFIT / LOSS</span>
                <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Max Win:</span>
                <span className="text-sm font-bold font-mono text-green-400">{maxProfitText}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Max Loss:</span>
                <span className="text-sm font-bold font-mono text-red-400">{maxLossText}</span>
              </div>
            </div>

            {/* Payoff at Target Price */}
            <div className={`p-4 rounded-xl border space-y-1 ${
              totalPnlAtTarget >= 0
                ? "bg-green-950/20 border-green-500/30"
                : "bg-red-950/20 border-red-500/30"
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>PAYOFF AT ${targetPrice}</span>
                {totalPnlAtTarget >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                )}
              </div>
              <p className={`text-xl font-bold font-mono ${totalPnlAtTarget >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalPnlAtTarget >= 0 ? "+" : ""}${totalPnlAtTarget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                {positionType === "Long" ? `Return on Risk: ${returnOnRiskPercent >= 0 ? "+" : ""}${returnOnRiskPercent}%` : `P&L at Target`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Sliders</CardTitle>
              <CardDescription>Fine-tune underlying price and parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium uppercase tracking-wider opacity-70">Underlying Price</label>
                  <span className="font-mono text-sm">${underlyingPrice}</span>
                </div>
                <Slider max={300} min={50} step={1} value={[underlyingPrice]} onValueChange={(v) => setUnderlyingPrice(v[0])} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium uppercase tracking-wider opacity-70">Strike Price</label>
                  <span className="font-mono text-sm">${strikePrice}</span>
                </div>
                <Slider max={300} min={50} step={1} value={[strikePrice]} onValueChange={(v) => setStrikePrice(v[0])} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium uppercase tracking-wider opacity-70">Option Cost / Premium</label>
                  <span className="font-mono text-sm">${premium.toFixed(2)}</span>
                </div>
                <Slider max={20} min={0.1} step={0.1} value={[premium]} onValueChange={(v) => setPremium(v[0])} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium uppercase tracking-wider opacity-70">Target Price at Expiry</label>
                  <span className="font-mono text-sm">${targetPrice}</span>
                </div>
                <Slider max={300} min={50} step={1} value={[targetPrice]} onValueChange={(v) => setTargetPrice(v[0])} />
              </div>

            </CardContent>
          </Card>

          <Card className="bg-card/50">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">Strategy Summary</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
               <div className="flex border-b border-white/5 pb-2 justify-between text-sm">
                 <span className="text-slate-400">Position</span>
                 <span className="font-mono">{positionType} {optionType}</span>
               </div>
               <div className="flex border-b border-white/5 pb-2 justify-between text-sm">
                 <span className="text-slate-400">Max Profit</span>
                 <span className="font-mono text-green-400">{maxProfitText}</span>
               </div>
               <div className="flex border-b border-white/5 pb-2 justify-between text-sm">
                 <span className="text-slate-400">Max Loss</span>
                 <span className="font-mono text-red-500">{maxLossText}</span>
               </div>
               <div className="flex pb-2 justify-between text-sm">
                 <span className="text-slate-400">Breakeven</span>
                 <span className="font-mono text-amber-400">
                   ${breakEven.toFixed(2)}
                 </span>
               </div>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Payoff Diagram</CardTitle>
              <CardDescription>P&L at expiration across stock prices (1 contract = {shares} shares).</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                  <XAxis 
                    dataKey="price" 
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    stroke="#888888" 
                    fontSize={12} 
                    tickFormatter={(val) => `$${val}`}
                    fontFamily="JetBrains Mono"
                  />
                  <YAxis 
                   stroke="#888888" 
                   fontSize={12}
                   tickFormatter={(val) => `$${val}`}
                   fontFamily="JetBrains Mono"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontFamily: "JetBrains Mono"}}
                    labelFormatter={(label) => `Stock Price: $${label}`}
                    formatter={(value: number) => {
                      const isPositive = value >= 0;
                      return [
                        <span key="pnl-val" style={{ color: isPositive ? '#10b981' : '#ef4444' }}>${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>,
                        "P&L"
                      ]
                    }}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3"/>
                  <ReferenceLine x={strikePrice} stroke="hsla(var(--primary), 0.5)" strokeDasharray="3 3" label={{ value: "Strike", position: 'top', fill: '#3b82f6', fontSize: 10 }} />
                  <ReferenceLine x={underlyingPrice} stroke="#888888" label={{ value: "Current", position: 'bottom', fill: '#888', fontSize: 10 }} />
                  <ReferenceLine x={targetPrice} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Target", position: 'top', fill: '#f59e0b', fontSize: 10 }} />
                  
                  <Line 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="var(--primary)" 
                    strokeWidth={3} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

