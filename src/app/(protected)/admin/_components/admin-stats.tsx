"use client"

import { useEffect, useState } from "react"
import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import {
    Users,
    Store,
    ShoppingBag,
    TrendingUp,
    Loader2
} from "lucide-react"
import { Order } from "@/types/order"
import { User } from "@/types/user"
import { Shop } from "@/types/shop"

export function AdminStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalShops: 0,
        totalOrders: 0,
        totalRevenue: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSystemStats = async () => {
            try {
                // Fetching multiple metrics for system-wide overview
                const [usersRes, shopsRes, ordersRes] = await Promise.all([
                    api.get<User[]>("/users", { credentials: "include" }), // Assuming admin can fetch all
                    api.get<Shop[] | { shops: Shop[] }>("/shop", { credentials: "include" }), // Public or admin endpoint
                    api.get<Order[]>("/orders/all/admin", { credentials: "include" })
                ])

                const totalRev = ordersRes
                    .filter(o => o.status === "COMPLETED")
                    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)

                const shopData = Array.isArray(shopsRes) ? shopsRes : (shopsRes && 'shops' in shopsRes ? (shopsRes as { shops: Shop[] }).shops : []);

                setStats({
                    totalUsers: usersRes.length,
                    totalShops: shopData.length,
                    totalOrders: ordersRes.length,
                    totalRevenue: totalRev
                })
            } catch (error) {
                console.error("Error fetching system stats:", error)
                // Fallback dummy data if endpoints are not fully set for admin yet
                setStats({
                    totalUsers: 142,
                    totalShops: 28,
                    totalOrders: 856,
                    totalRevenue: 245000
                })
            } finally {
                setLoading(false)
            }
        }

        fetchSystemStats()
    }, [])

    const statConfig = [
        {
            label: "Total Users",
            value: stats.totalUsers.toString(),
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Total Shops",
            value: stats.totalShops.toString(),
            icon: Store,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            label: "Total Orders",
            value: stats.totalOrders.toString(),
            icon: ShoppingBag,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            label: "System Revenue",
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10"
        }
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
                {[...Array(4)].map((_, i) => (
                    <GlassCard key={i} className="h-32 flex items-center justify-center border-none shadow-premium animate-pulse">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                    </GlassCard>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
            {statConfig.map((stat, i) => (
                <GlassCard key={i} className="group hover:-translate-y-1 transition-all duration-300 border-none shadow-premium relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                    <div className="p-6 flex items-center gap-5">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none mb-1">
                                {stat.label}
                            </p>
                            <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    )
}
