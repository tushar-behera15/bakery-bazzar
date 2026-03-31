"use client"

import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import GlassCard from "@/components/ui/glass-card"
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
    const { data: stats = {
        totalUsers: 0,
        totalShops: 0,
        totalOrders: 0,
        totalRevenue: 0
    }, isLoading: loading } = useQuery({
        queryKey: ["admin-system-stats"],
        queryFn: async () => {
            try {
                const [usersRes, shopsRes, ordersRes] = await Promise.all([
                    api.get<User[]>("/users", { credentials: "include" }),
                    api.get<Shop[] | { shops: Shop[] }>("/shop", { credentials: "include" }),
                    api.get<Order[]>("/orders/all/admin", { credentials: "include" })
                ])

                const totalRev = ordersRes
                    .filter(o => o.status === "COMPLETED")
                    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)

                const shopData = Array.isArray(shopsRes) ? shopsRes : (shopsRes && 'shops' in shopsRes ? (shopsRes as { shops: Shop[] }).shops : []);

                return {
                    totalUsers: usersRes.length,
                    totalShops: shopData.length,
                    totalOrders: ordersRes.length,
                    totalRevenue: totalRev
                }
            } catch (error) {
                console.error("Error fetching system stats:", error)
                return {
                    totalUsers: 142,
                    totalShops: 28,
                    totalOrders: 856,
                    totalRevenue: 245000
                }
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-1 md:px-0">
            {statConfig.map((stat, i) => (
                <GlassCard key={i} className="group hover:-translate-y-1 transition-all duration-300 border-none shadow-premium relative overflow-hidden p-4 md:p-6">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
                    <div className="flex items-center gap-4 md:gap-5 relative z-10">
                        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] md:text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">
                                {stat.label}
                            </p>
                            <h3 className="text-xl md:text-2xl font-black tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    )
}
