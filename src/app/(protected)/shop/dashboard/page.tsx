"use client"

import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { ShopHero } from "./_components/shop-hero"
import { ShopStats } from "./_components/shop-stats"
import { ShopRecentOrders } from "./_components/recent-orders"
import { ChartAreaInteractive } from "@/components/dashboard-stuffs/chart-area-interactive"

interface Shop {
    id: number
    name: string
}

export default function Page() {
    const { data: shop, isLoading: loading } = useQuery<Shop>({
        queryKey: ["shop-me"],
        queryFn: async () => {
            const res = await api.get<{ shop: Shop }>("/shop/me", { credentials: "include" })
            return res.shop
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Preparing your bakery analytics...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-500">
            {/* 1. Seller Hero */}
            <ShopHero shopName={shop?.name || "Your Shop"} />

            {/* 2. Seller Statistics */}
            <ShopStats />

            {/* 3. Sales Analytics Chart */}
            <div className="px-0">
                <ChartAreaInteractive />
            </div>

            {/* 4. Recent Orders Table/List */}
            <ShopRecentOrders />
        </div>
    )
}
