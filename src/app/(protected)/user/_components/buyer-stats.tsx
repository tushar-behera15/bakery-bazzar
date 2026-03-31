import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { ShoppingCart, Package, MapPin, Loader2 } from "lucide-react"

interface Stats {
    totalOrders: number
    cartItems: number
    savedAddresses: number
}

export function BuyerStats({ userId }: { userId: number }) {
    const { data: stats, isLoading: loading } = useQuery<Stats>({
        queryKey: ["user-stats", userId],
        queryFn: async () => {
            const [ordersData, cartData, addressesData] = await Promise.all([
                api.get<unknown[]>(`/orders?buyerId=${userId}`, { credentials: "include" }),
                api.get<{ items?: unknown[], totalCount?: number }>("/cart", { credentials: "include" }),
                api.get<unknown[]>(`/addresses/user/${userId}`, { credentials: "include" })
            ])

            return {
                totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
                cartItems: cartData?.totalCount ?? cartData?.items?.length ?? 0,
                savedAddresses: Array.isArray(addressesData) ? addressesData.length : 0
            }
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    })



    if (loading || !stats) {
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

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-1 md:px-0">
            {statItems.map((item, index) => (
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
