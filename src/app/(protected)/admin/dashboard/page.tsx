"use client"

import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { AdminHero } from "../_components/admin-hero"
import { AdminStats } from "../_components/admin-stats"
import { AdminRecentSellers } from "../_components/admin-recent-sellers"
import { useQuery } from "@tanstack/react-query"

interface Admin {
    id: number
    name: string
    email: string
}


export default function Page() {
    const { data: admin, isLoading: loading } = useQuery<Admin>({
        queryKey: ["admin-me"],
        queryFn: async () => {
            const res = await api.get<{ user: Admin }>("/auth/me", { credentials: "include" })
            return res.user
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

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
