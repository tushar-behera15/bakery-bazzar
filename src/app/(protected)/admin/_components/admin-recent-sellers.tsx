"use client"

import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import GlassCard from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Store, ChevronRight, Loader2, Calendar } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Shop } from "@/types/shop"

export function AdminRecentSellers() {
    const { data: shops = [], isLoading: loading } = useQuery<Shop[]>({
        queryKey: ["admin-recent-shops"],
        queryFn: async () => {
            const res = await api.get<Shop[] | { shops: Shop[] }>("/shop", { credentials: "include" })
            return Array.isArray(res) ? res.slice(0, 5) : res.shops.slice(0, 5)
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    return (
        <GlassCard className="border-none shadow-xl overflow-hidden px-4 lg:px-6">
            <div className="p-4 sm:p-6 pb-2 flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Recent Onboardings</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">New bakeshops joining the platform</p>
                </div>
                <Link href="/admin/dashboard/sellers">
                    <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5 gap-1 group whitespace-nowrap h-10 px-3 sm:px-4">
                        Manage Sellers <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                </Link>
            </div>

            <div className="p-6 pt-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-muted-foreground italic">Fetching recent activity...</p>
                    </div>
                ) : shops.length > 0 ? (
                    <div className="space-y-4">
                        {shops.map((shop) => (
                            <div 
                                key={shop.id} 
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                        <Store className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-sm sm:text-base line-clamp-1">{shop.name}</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground font-semibold">
                                                <Calendar className="h-3 w-3" />
                                                Joined {format(new Date(shop.createdAt || new Date()), "MMM d, yyyy")}
                                            </div>
                                            <Badge className={`text-[9px] font-black px-2 py-0 h-5 border uppercase tracking-widest ${shop.isActive ? "bg-green-500/5 text-green-500 border-green-500/10" : "bg-red-500/5 text-red-500 border-red-500/10"}`}>
                                                {shop.isActive ? "ACTIVE" : "INACTIVE"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 border-t sm:border-t-0 border-primary/5 pt-3 sm:pt-0">
                                    <div className="text-left sm:text-right">
                                        <p className="text-[10px] font-bold text-muted-foreground italic line-clamp-1">Owner: {shop.owner.name}</p>
                                        <p className="text-xs font-semibold text-muted-foreground line-clamp-1">{shop.contactEmail}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" asChild className="sm:hidden h-8 text-primary font-bold px-2">
                                        <Link href="/admin/dashboard/sellers">Details</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Store className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="font-bold text-lg text-muted-foreground">No recent bakeshops recorded.</p>
                    </div>
                )}
            </div>
        </GlassCard>
    )
}
