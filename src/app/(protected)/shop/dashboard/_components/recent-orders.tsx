"use client"

import { useEffect, useState } from "react"
import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight, Package, Loader2 } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import type { Order } from "@/types/order"

export function ShopRecentOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch shop specific orders
                // Assuming we can filter or have a dedicated endpoint
                const res = await api.get<Order[]>("/orders/shop/me", { credentials: "include" })
                // Filter for current shop (logic might be needed if /orders returns everything)
                // For now just taking first 5
                setOrders(res.slice(0, 5))
            } catch (error) {
                console.error("Error fetching recent orders for shop:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

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
            <div className="p-6 pb-2 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Recent Sales</h3>
                    <p className="text-sm text-muted-foreground">Stay updated on your latest customer purchases</p>
                </div>
                <Link href="/shop/dashboard/orders">
                    <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5 gap-1 group">
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
                                className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Order #{order.id.toString().padStart(4, '0')}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                            </div>
                                            <Badge className={`text-[10px] font-bold px-2 py-0 h-5 border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-primary">₹{order.totalAmount}</p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{order.items?.length || 0} items</p>
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
