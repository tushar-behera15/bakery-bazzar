"use client"

import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
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
    const { data: stats = { revenue: 0, orders: 0, products: 0, rating: 4.9 }, isLoading: loading } = useQuery({
        queryKey: ["shop-stats"],
        queryFn: async () => {
            const [ordersRes, productsRes] = await Promise.all([
                api.get<Order[]>("/orders/shop/me", { credentials: "include" }),
                api.get<unknown[]>("/product/me", { credentials: "include" })
            ])

            const totalOrders = ordersRes.length
            const totalRevenue = ordersRes
                .filter((o: Order) => o.status === "COMPLETED")
                .reduce((acc: number, current: Order) => acc + current.totalAmount, 0)
            
            return {
                revenue: totalRevenue,
                orders: totalOrders,
                products: productsRes.length,
                rating: 4.9
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-1 md:px-0">
            {statConfig.map((item, index) => (
                <GlassCard key={index} className="group hover:border-primary/30 transition-all duration-300 p-4 md:p-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                            <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                            <h3 className="text-xl md:text-2xl font-black">{item.value}</h3>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    )
}
