"use client"

import { useEffect, useState } from "react"
import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Store, ChevronRight, Loader2, Calendar } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Shop } from "@/types/shop"

export function AdminRecentSellers() {
    const [shops, setShops] = useState<Shop[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecentShops = async () => {
            try {
                const res = await api.get<Shop[] | { shops: Shop[] }>("/shop", { credentials: "include" })
                const shopData = Array.isArray(res) ? res : res.shops;
                // Latest 5 shops
                setShops(shopData.slice(0, 5))
            } catch (error) {
                console.error("Error fetching recent shops for admin:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchRecentShops()
    }, [])

    return (
        <GlassCard className="border-none shadow-xl overflow-hidden px-4 lg:px-6">
            <div className="p-6 pb-2 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Recent Seller Onboardings</h3>
                    <p className="text-sm text-muted-foreground">Keep track of new bakeshops joining the Bakery Bazaar platform</p>
                </div>
                <Link href="/admin/dashboard/sellers">
                    <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5 gap-1 group">
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
                                className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Store className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{shop.name}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                <Calendar className="h-3 w-3" />
                                                Joined {format(new Date(shop.createdAt || new Date()), "MMM dd, yyyy")}
                                            </div>
                                            <Badge className={`text-[10px] font-bold px-2 py-0 h-5 border ${shop.isActive ? "bg-green-500/5 text-green-500 border-green-500/10" : "bg-red-500/5 text-red-500 border-red-500/10"}`}>
                                                {shop.isActive ? "ACTIVE" : "INACTIVE"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-muted-foreground italic">Owner: {shop.owner.name}</p>
                                    <p className="text-sm font-medium text-muted-foreground">{shop.contactEmail}</p>
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
