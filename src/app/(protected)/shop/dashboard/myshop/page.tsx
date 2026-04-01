"use client"

import * as React from "react"
import { IconChartBar, IconHistory, IconRocket } from "@tabler/icons-react"
import { ShopStats } from "../_components/shop-stats"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import GlassCard from "@/components/ui/glass-card"

export default function MyShopPage() {
  return (
    <div className="p-4 sm:p-8 space-y-10 max-w-[1400px] mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">Business Hub</h1>
          <p className="text-muted-foreground text-sm font-medium opacity-70 italic font-mono tracking-tight">Your bakery empire at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-6 shadow-premium">
            <IconRocket className="w-4 h-4 mr-2" /> Launch Promotion
          </Button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <IconChartBar className="w-4 h-4" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Live Performance Analytics</h2>
        </div>
        <ShopStats />
      </div>

      <Separator className="opacity-20" />

      {/* Summary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 rounded-[2.5rem] bg-card/30 backdrop-blur-3xl border-border/40 shadow-premium">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
               <IconHistory className="w-4 h-4" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Recent Activity Feed</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
               <IconHistory className="w-8 h-8 text-muted-foreground opacity-20" />
            </div>
            <p className="text-xs font-medium text-muted-foreground max-w-[200px]">
              No recent changes detected. Your shop is running smoothly.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-8 rounded-[2.5rem] bg-card/30 backdrop-blur-3xl border-border/40 shadow-premium">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
               <IconRocket className="w-4 h-4" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Sales Goal Progress</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Monthly Target</span>
                <span className="text-primary">65% Achieved</span>
              </div>
              <div className="h-3 w-full bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic font-medium">
              You are ₹12,450 away from your monthly bakery revenue goal!
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
