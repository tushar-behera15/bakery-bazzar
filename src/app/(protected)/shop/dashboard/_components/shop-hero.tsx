"use client"

import GlassCard from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Store, Plus, Package, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ShopHeroProps {
    shopName: string
}

export function ShopHero({ shopName }: ShopHeroProps) {
    return (
        <GlassCard className="relative w-full overflow-hidden border-none shadow-2xl p-0 min-h-[220px]">
            {/* Decorative background elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[140%] bg-primary/10 blur-[80px] rounded-full rotate-12 animate-pulse" />
            <div className="absolute bottom-[-30%] left-[-5%] w-[30%] h-[100%] bg-primary/5 blur-[60px] rounded-full" />
            
            <div className="relative z-10 p-8 md:p-12 w-full min-h-[220px] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                        <Store className="h-3 w-3" />
                        <span>Seller Dashboard</span>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                            Welcome to <span className="text-primary">{shopName || "Your Shop"}</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto md:mx-0">
                            Manage your bakery items, track your sales, and grow your business today.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                        <Link href="/shop/dashboard/products/add">
                            <Button className="rounded-xl h-12 px-6 gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                                <Plus className="h-5 w-5" /> Add Product
                            </Button>
                        </Link>
                        <Link href="/shop/dashboard/orders">
                            <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 font-bold transition-all hover:bg-primary/5">
                                <Package className="h-5 w-5" /> Manage Orders
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Visual element */}
                <div className="hidden lg:flex relative w-48 h-48 items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative z-20 text-7xl select-none group-hover:scale-110 transition-transform duration-500">🏬</div>
                </div>
            </div>
        </GlassCard>
    )
}
