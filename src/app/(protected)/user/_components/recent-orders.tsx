import GlassCard from "@/components/ui/glass-card"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, ChevronRight, Package } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Order {
    id: number
    totalAmount: number
    status: string
    createdAt: string
}

export function RecentOrders({ userId }: { userId: number }) {
    const { data: orders = [], isLoading: loading } = useQuery<Order[]>({
        queryKey: ["user-recent-orders", userId],
        queryFn: async () => {
            const data = await api.get<Order[]>(`/orders?buyerId=${userId}`, { credentials: "include" })
            return data.slice(0, 5)
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    })

    if (loading) return (
        <GlassCard className="h-60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading recent orders...</p>
            </div>
        </GlassCard>
    )

    return (
        <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-primary/10 flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Recent Orders</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Latest purchases</p>
                </div>
                <Button variant="ghost" asChild className="text-primary hover:bg-primary/5 rounded-xl font-bold whitespace-nowrap h-10 px-3 sm:px-4">
                    <Link href="/user/dashboard/orders">
                        View All
                        <ChevronRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>
            </div>
            
            <div className="divide-y divide-primary/5">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary/[0.02] transition-colors relative">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl shrink-0 ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                                    {order.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-black text-sm sm:text-base">Order #{order.id}</p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 border-t sm:border-t-0 border-primary/5 pt-3 sm:pt-0">
                                <div className="text-left sm:text-right">
                                    <p className="font-black text-primary text-sm sm:text-base">₹{order.totalAmount.toLocaleString()}</p>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0 border-primary/20">
                                        {order.status}
                                    </Badge>
                                </div>
                                <Button size="sm" variant="outline" asChild className="rounded-lg sm:rounded-xl border-primary/10 hover:border-primary/30 transition-all font-bold h-9">
                                    <Link href="/user/dashboard/orders">Details</Link>
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center">
                        <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground">No orders found yet.</p>
                        <Button asChild className="mt-4 rounded-xl" variant="outline">
                            <Link href="/">Start Shopping</Link>
                        </Button>
                    </div>
                )}
            </div>
        </GlassCard>
    )
}
