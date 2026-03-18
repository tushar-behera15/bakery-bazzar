"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { DashboardHero } from "@/app/(protected)/user/_components/dashboard-hero"
import { BuyerStats } from "@/app/(protected)/user/_components/buyer-stats"
import { RecentOrders } from "@/app/(protected)/user/_components/recent-orders"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface User {
    id: number
    name: string
    email: string
}

export default function Page() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get<{ user: User }>("/auth/me", { credentials: "include" })
                setUser(res.user)
            } catch (error) {
                console.error("Error fetching user for dashboard:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) return <div>Please log in to view your dashboard.</div>

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-500">
            {/* 1. Welcome Hero */}
            <DashboardHero userName={user.name} />

            {/* 2. Stats Section */}
            <BuyerStats userId={user.id} />

            {/* 3. Recent Activity Section */}
            <div className="grid grid-cols-1 gap-8">
                <RecentOrders userId={user.id} />
                
                {/* Optional: Add more widgets here later like "Saved Products" or "Loyalty" */}
            </div>
        </div>
    )
}
