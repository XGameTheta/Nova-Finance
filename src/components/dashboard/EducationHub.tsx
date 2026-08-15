import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, AlertTriangle, Lightbulb } from "lucide-react";

export function EducationHub() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Theory & Education</h2>
        <p className="text-muted-foreground mt-1">Master the concepts before you trade.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
           <CardHeader>
             <div className="flex items-center gap-2 mb-2">
               <BookOpen className="h-5 w-5 text-primary" />
               <Badge>Beginner</Badge>
             </div>
             <CardTitle>What are Options?</CardTitle>
             <CardDescription>The fundamentals of derivatives.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4 text-sm text-foreground/90">
             <p>
               An option is a contract giving the buyer the right, but not the obligation, to buy (in the case of a call) or sell (in the case of a put) an underlying asset at a specific price on or before a certain date.
             </p>
             <div className="bg-muted p-4 rounded-lg flex gap-3">
               <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0" />
               <p className="text-xs">
                 <strong>Metaphor:</strong> Buying a Call option is like putting a deposit down to hold a house at yesterday's price, hoping the market value goes up.
               </p>
             </div>
           </CardContent>
        </Card>

        <Card>
           <CardHeader>
             <div className="flex items-center gap-2 mb-2">
               <AlertTriangle className="h-5 w-5 text-orange-500" />
               <Badge variant="outline">Risk Warning</Badge>
             </div>
             <CardTitle>The Danger of "Selling Naked"</CardTitle>
             <CardDescription>Why risk management is everything.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4 text-sm text-foreground/90">
             <p>
               Selling a call without owning the underlying stock is called "Short Naked Call". Because a stock's price can technically rise to infinity, the potential loss on this strategy is <strong>theoretically infinite</strong>.
             </p>
             <p>
               Young investors should strongly prefer <em>defined risk</em> strategies like spreads or covered calls instead of unhedged short positions.
             </p>
           </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">Standard Strategies Reference</h3>
      
      <Accordion type="single" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left font-medium">Covered Call (Yield Generation)</AccordionTrigger>
          <AccordionContent className="text-slate-400">
            <p className="mb-2 text-foreground/80">
              You own 100 shares of a stock and sell 1 Call option against it. 
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4 text-foreground/80">
              <li><strong>Market direction bias:</strong> Neutral to slightly bullish.</li>
              <li><strong>Risk:</strong> Limited to the downside of the stock you own.</li>
              <li><strong>Reward:</strong> Capped at the strike price plus premium received.</li>
            </ul>
             <div className="bg-card border border-border p-3 rounded-md font-mono text-xs text-muted-foreground flex items-center justify-between">
                <span>Expected return profile is lower volatility compared to holding pure stock.</span>
             </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left font-medium">Protective Put (Insurance)</AccordionTrigger>
          <AccordionContent className="text-slate-400">
            <p className="mb-2 text-foreground/80">
              You own 100 shares of a stock and buy 1 Put option to protect against a crash.
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4 text-foreground/80">
              <li><strong>Market direction bias:</strong> Bullish long term, defensively bearish short term.</li>
              <li><strong>Risk:</strong> Premium paid for the put.</li>
              <li><strong>Reward:</strong> Unlimited to the upside (minus premium).</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left font-medium">Iron Condor (Delta Neutral)</AccordionTrigger>
          <AccordionContent className="text-slate-400">
             <p className="mb-2 text-foreground/80">
              Selling an out-of-the-money put spread and out-of-the-money call spread simultaneously.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li><strong>Market direction bias:</strong> Neutral (expecting low volatility).</li>
              <li><strong>Risk:</strong> Defined difference between strikes minus net premium.</li>
              <li><strong>Reward:</strong> Limited to the net premium collected.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left font-medium">Future Contracts (Leveraged Delta)</AccordionTrigger>
          <AccordionContent className="text-slate-400">
             <p className="mb-2 text-foreground/80">
               An agreement to buy or sell an asset at a predetermined price at a specified time in the future.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li><strong>Market direction bias:</strong> Pure directional (Long/Short).</li>
              <li><strong>Risk:</strong> Theoretically infinite if unhedged. Margin calls can wipe accounts quickly.</li>
              <li><strong>Reward:</strong> Pure linear reward, amplified heavily by leverage.</li>
            </ul>
            <div className="bg-orange-500/10 border border-orange-500/50 p-3 rounded-md mt-4 text-xs">
              <span className="text-orange-500 font-bold block mb-1">WARNING:</span>
              <span className="text-foreground/80">Futures require high margin and settle daily. A small move against your position can result in account liquidation. Use them primarily for portfolio hedging rather than speculation.</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
