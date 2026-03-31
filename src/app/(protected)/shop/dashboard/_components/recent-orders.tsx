"use client"

import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight, Package, Loader2 } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import type { Order } from "@/types/order"

export function ShopRecentOrders() {
    const { data: orders = [], isLoading: loading } = useQuery<Order[]>({
        queryKey: ["shop-recent-orders"],
        queryFn: async () => {
            const res = await api.get<Order[]>("/orders/shop/me", { credentials: "include" })
            return res.slice(0, 5)
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-green-500/10 text-green-500 border-green-500/20"
            case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            case "CANCELLED": return "bg-red-500/10 text-red-500 border-red-500/20"
            default: return "bg-blue-500/10 text-blue-500 border-blue-500/20"
        }
    }

    return (
        <GlassCard className="border-none shadow-xl overflow-hidden px-4 lg:px-6">
            <div className="p-4 sm:p-6 pb-2 flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Recent Sales</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Latest customer purchases</p>
                </div>
                <Link href="/shop/dashboard/orders">
                    <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5 gap-1 group whitespace-nowrap h-10 px-3 sm:px-4">
                        View All <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                </Link>
            </div>

            <div className="p-6 pt-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-muted-foreground italic">Fetching your orders...</p>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div 
                                key={order.id} 
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-sm sm:text-base">Order #{order.id.toString().padStart(4, '0')}</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground font-semibold">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(order.createdAt), "MMM d, yyyy")}
                                            </div>
                                            <Badge className={`text-[9px] font-black px-2 py-0 h-5 border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 border-t sm:border-t-0 border-primary/5 pt-3 sm:pt-0">
                                    <div className="text-left sm:text-right">
                                        <p className="text-base sm:text-lg font-black text-primary leading-tight">₹{order.totalAmount.toLocaleString()}</p>
                                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">{order.items?.length || 0} items</p>
                                    </div>
                                    <Button size="sm" variant="ghost" asChild className="sm:hidden h-8 text-primary font-bold px-2">
                                        <Link href="/shop/dashboard/orders">Details</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">No orders found yet.</p>
                            <p className="text-sm text-muted-foreground">Keep up the good work! Your first sale is just around the corner.</p>
                        </div>
                    </div>
                )}
            </div>
        </GlassCard>
    )
}
