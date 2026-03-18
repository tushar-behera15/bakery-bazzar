"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, ChevronRight, Package } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Order {
    id: number
    totalAmount: number
    status: string
    createdAt: string
}

export function RecentOrders({ userId }: { userId: number }) {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.get<Order[]>(`/orders?buyerId=${userId}`, { credentials: "include" })
                // Get the most recent 5
                setOrders(data.slice(0, 5))
            } catch (error) {
                console.error("Error fetching recent orders:", error)
            } finally {
                setLoading(false)
            }
        }

        if (userId) fetchOrders()
    }, [userId])

    if (loading) return (
        <GlassCard className="h-60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading recent orders...</p>
            </div>
        </GlassCard>
    )

    return (
        <GlassCard className="p-0 overflow-hidden">
            <div className="p-6 border-b border-primary/10 flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Recent Orders</h3>
                    <p className="text-sm text-muted-foreground">Stay updated on your latest purchases</p>
                </div>
                <Button variant="ghost" asChild className="text-primary hover:text-primary hover:bg-primary/5 rounded-xl font-bold whitespace-nowrap">
                    <Link href="/user/dashboard/orders">
                        View All
                        <ChevronRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>
            </div>
            
            <div className="divide-y divide-primary/5">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="p-6 flex items-center justify-between hover:bg-primary/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                                    {order.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold">Order #{order.id}</p>
                                    <p className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "MMMM d, yyyy")}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="font-bold">₹{order.totalAmount.toFixed(2)}</p>
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider py-0">
                                        {order.status}
                                    </Badge>
                                </div>
                                <Button size="sm" variant="outline" asChild className="rounded-xl border-primary/10 hover:border-primary/30 transition-all">
                                    <Link href="/user/dashboard/orders">Details</Link>
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center">
                        <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground">No orders found yet.</p>
                        <Button asChild className="mt-4 rounded-xl" variant="outline">
                            <Link href="/">Start Shopping</Link>
                        </Button>
                    </div>
                )}
            </div>
        </GlassCard>
    )
}
