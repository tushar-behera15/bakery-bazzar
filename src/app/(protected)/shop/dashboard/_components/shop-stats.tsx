"use client"

import { useEffect, useState } from "react"
import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { 
    TrendingUp, 
    Package, 
    ShoppingBag, 
    Star,
    Loader2
} from "lucide-react"

interface Order {
    id: number
    totalAmount: number
    status: string
}

export function ShopStats() {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        rating: 4.9
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch relevant shop data
                const [ordersRes, productsRes] = await Promise.all([
                    api.get<Order[]>("/orders/shop/me", { credentials: "include" }),
                    api.get<unknown[]>("/product/me", { credentials: "include" })
                ])

                const totalOrders = ordersRes.length
                const totalRevenue = ordersRes
                    .filter((o: Order) => o.status === "COMPLETED")
                    .reduce((acc: number, current: Order) => acc + current.totalAmount, 0)
                
                setStats({
                    revenue: totalRevenue,
                    orders: totalOrders,
                    products: productsRes.length,
                    rating: 4.9
                })
            } catch (error) {
                console.error("Error fetching shop stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const statConfig = [
        { 
            label: "Total Revenue", 
            value: `₹${stats.revenue.toLocaleString()}`, 
            icon: TrendingUp, 
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        { 
            label: "Total Orders", 
            value: stats.orders.toString(), 
            icon: ShoppingBag, 
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        { 
            label: "Products", 
            value: stats.products.toString(), 
            icon: Package, 
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        { 
            label: "Shop Rating", 
            value: stats.rating.toFixed(1), 
            icon: Star, 
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        }
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <GlassCard key={i} className="h-32 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </GlassCard>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
            {statConfig.map((stat, i) => (
                <GlassCard key={i} className="group hover:-translate-y-1 transition-all duration-300 border-none shadow-premium">
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
