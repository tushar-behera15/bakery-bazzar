"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { AdminHero } from "../_components/admin-hero"
import { AdminStats } from "../_components/admin-stats"
import { AdminRecentSellers } from "../_components/admin-recent-sellers"

interface Admin {
    id: number
    name: string
    email: string
}


export default function Page() {
    const [admin, setAdmin] = useState<Admin | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                // Fetch admin details
                const adminRes = await api.get<{ user: Admin }>("/auth/me", { credentials: "include" })
                setAdmin(adminRes.user)
            } catch (error: unknown) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAdmin()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Initializing system overview...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-500">
            {/* 1. Admin Hero */}
            <AdminHero adminName={admin?.name || "Admin"} />

            {/* 2. System Statistics */}
            <AdminStats />

            {/* 3. Recent Platform Activity (Sellers) */}
            <AdminRecentSellers />
        </div>
    )
}
