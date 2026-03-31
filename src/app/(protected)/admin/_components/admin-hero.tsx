"use client"

import GlassCard from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Store, Settings, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AdminHeroProps {
    adminName: string
}

export function AdminHero({ adminName }: AdminHeroProps) {
    return (
        <GlassCard className="relative w-full overflow-hidden border-none shadow-2xl p-0 min-h-[220px]">
            {/* Decorative background elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[140%] bg-primary/10 blur-[80px] rounded-full rotate-12 animate-pulse" />
            <div className="absolute bottom-[-30%] left-[-5%] w-[30%] h-[100%] bg-primary/5 blur-[60px] rounded-full" />
            
            <div className="relative z-10 p-6 md:p-12 w-full min-h-[220px] flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-6 text-center md:text-left flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-widest mx-auto md:mx-0">
                        <ShieldCheck className="h-3 w-3" />
                        <span>System Administration</span>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Welcome Back, <span className="text-primary">{adminName || "Admin"}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0 font-medium">
                            Monitor system performance, manage users, and oversee all bakery shop operations from one central hub.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
                        <Link href="/admin/dashboard/sellers" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto rounded-xl h-14 px-8 gap-2 font-black shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                                <Store className="h-5 w-5" /> Manage Shops
                            </Button>
                        </Link>
                        <Link href="/admin/dashboard/profile" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto rounded-xl h-14 px-8 gap-2 font-black transition-all border-primary/20 hover:bg-primary/5">
                                <Settings className="h-5 w-5" /> System Settings
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Visual element */}
                <div className="hidden lg:flex relative w-48 h-48 items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative z-20 text-7xl select-none group-hover:scale-110 transition-transform duration-500">🛡️</div>
                </div>
            </div>
        </GlassCard>
    )
}
