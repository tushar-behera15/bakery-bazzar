"use client"

import * as React from "react"
import GlassCard from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

interface DashboardHeroProps {
    userName: string
}

export function DashboardHero({ userName }: DashboardHeroProps) {
    return (
        <GlassCard className="relative w-full overflow-hidden border-none shadow-2xl p-0 min-h-[220px]">
            {/* Decorative background elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[140%] bg-primary/10 blur-[80px] rounded-full rotate-12 animate-pulse" />
            <div className="absolute bottom-[-30%] left-[-5%] w-[30%] h-[100%] bg-primary/5 blur-[60px] rounded-full" />
            
            <div className="relative z-10 p-8 md:p-12 w-full min-h-[220px] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-4 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                        Welcome back, <span className="text-primary">{userName || "Baker"}</span>!
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-[500px]">
                        Your fresh bakes are just a click away. Ready to discover something delicious today?
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                        <Button asChild size="lg" className="rounded-xl px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                            <Link href="/">
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                Browse Bakery
                            </Link>
                        </Button>
                        <Button variant="outline" asChild size="lg" className="rounded-xl px-8 py-6 text-lg font-bold border-primary/20 hover:bg-primary/5 transition-all">
                            <Link href="/user/dashboard/orders">
                                Track Orders
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
                
                {/* Visual element (could be an image or illustration) */}
                <div className="hidden lg:flex relative w-48 h-48 items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative z-20 text-7xl">🥐</div>
                </div>
            </div>
        </GlassCard>
    )
}
