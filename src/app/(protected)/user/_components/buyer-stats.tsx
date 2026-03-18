"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { ShoppingCart, Package, MapPin, Loader2 } from "lucide-react"

interface Stats {
    totalOrders: number
    cartItems: number
    savedAddresses: number
}

export function BuyerStats({ userId }: { userId: number }) {
    const [stats, setStats] = useState<Stats>({
        totalOrders: 0,
        cartItems: 0,
        savedAddresses: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch stats concurrently
                const [ordersData, cartData, addressesData] = await Promise.all([
                    api.get<unknown[]>(`/orders?buyerId=${userId}`, { credentials: "include" }),
                    api.get<{ items?: unknown[] }>("/cart", { credentials: "include" }),
                    api.get<unknown[]>(`/addresses/user/${userId}`, { credentials: "include" })
                ])

                setStats({
                    totalOrders: ordersData.length || 0,
                    cartItems: cartData?.items?.length || 0,
                    savedAddresses: addressesData.length || 0
                })
            } catch (error) {
                console.error("Error fetching dashboard stats:", error)
            } finally {
                setLoading(false)
            }
        }

        if (userId) fetchStats()
    }, [userId])

    const statItems = [
        {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: Package,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Cart Items",
            value: stats.cartItems,
            icon: ShoppingCart,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            label: "Saved Addresses",
            value: stats.savedAddresses,
            icon: MapPin,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 lg:px-6">
                {[1, 2, 3].map((i) => (
                    <GlassCard key={i} className="h-32 flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary/40" />
                    </GlassCard>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 lg:px-6">
            {statItems.map((item, index) => (
                <GlassCard key={index} className="group hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
                            <h3 className="text-2xl font-bold">{item.value}</h3>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    )
}
