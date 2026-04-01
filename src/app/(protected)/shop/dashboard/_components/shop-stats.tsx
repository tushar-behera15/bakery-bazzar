"use client"

import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import {
    IconTrendingUp,
    IconShoppingBag,
    IconCash,
    IconUsers,
    IconLoader2,
    IconCreditCard
} from "@tabler/icons-react"

interface Payment {
    id: number
    amount: number
    status: string
    method: string
    orderId: number
    createdAt: string
    paidAt: string | null
    order?: {
        buyerId: number
        buyer?: {
            name: string
        }
    }
}

export function ShopStats() {
    const { data: stats = { revenue: 0, orders: 0, aov: 0, cashRatio: 0, topBuyer: "No Sales" }, isLoading: loading } = useQuery({
        queryKey: ["shop-stats"],
        queryFn: async () => {
            const paymentsRes = await api.get<Payment[]>("/payments/shop/me", { credentials: "include" })

            // 📈 Analytics Calculation
            const successfulPayments = paymentsRes.filter(p => p.status === "SUCCESS" || p.status === "COMPLETED")
            const totalRevenue = successfulPayments.reduce((acc, p) => acc + p.amount, 0)
            const totalOrders = successfulPayments.length
            const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0

            // Cash vs Online
            const cashCount = successfulPayments.filter(p => p.method === "CASH").length
            const cashRatio = totalOrders > 0 ? (cashCount / totalOrders) * 100 : 0

            // Top Buyer
            const buyerMap = successfulPayments.reduce((acc, p) => {
                const name = p.order?.buyer?.name || `User #${p.order?.buyerId}`
                acc[name] = (acc[name] || 0) + p.amount
                return acc
            }, {} as Record<string, number>)

            const topBuyerEntry = Object.entries(buyerMap).sort((a, b) => b[1] - a[1])[0]

            return {
                revenue: totalRevenue,
                orders: totalOrders,
                aov: averageOrderValue,
                cashRatio: cashRatio,
                topBuyer: topBuyerEntry ? topBuyerEntry[0] : "No Sales"
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    const statConfig = [
        {
            label: "Total Revenue",
            value: `₹${stats.revenue.toLocaleString()}`,
            subValue: `${stats.orders} Successful Orders`,
            icon: IconTrendingUp,
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            label: "Avg. Order Value",
            value: `₹${Math.round(stats.aov).toLocaleString()}`,
            subValue: "Customer Spending",
            icon: IconCreditCard,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Cash Ratio",
            value: `${Math.round(stats.cashRatio)}%`,
            subValue: "Method Distribution",
            icon: IconCash,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            label: "Top Customer",
            value: stats.topBuyer,
            subValue: "Lifetime Value Leader",
            icon: IconUsers,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        }
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <GlassCard key={i} className="h-40 flex flex-col items-center justify-center rounded-[2rem]">
                        <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Analytics...</span>
                    </GlassCard>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statConfig.map((item, index) => (
                <GlassCard key={index} className="group hover:border-primary/30 transition-all duration-500 p-6 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <item.icon className="w-20 h-20" />
                    </div>
                    <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{item.label}</p>
                            <h3 className="text-2xl font-black tracking-tight truncate pr-4">{item.value}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground italic opacity-40">{item.subValue}</p>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    )
}
