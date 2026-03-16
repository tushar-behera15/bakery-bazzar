"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import GlassCard from "@/components/ui/glass-card";
import SectionTitle from "@/components/shared/SectionTitle";
import { OrderCard } from "@/components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const data = await api.get<Order[]>(`/orders?buyerId=${user.id}`);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.id]);

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(search) ||
    order.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-12 md:py-20 bg-background min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <SectionTitle
            title="My Orders"
            subtitle="Manage and track your recent bakery purchases"
            align="left"
          />

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by ID or status..."
              className="pl-12 h-14 rounded-2xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-soft hover:shadow-premium transition-all text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <GlassCard key={i} className="p-6 space-y-4">
                <Skeleton className="h-32 w-full rounded-2xl opacity-50" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4 opacity-50" />
                  <Skeleton className="h-5 w-1/2 opacity-50" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <GlassCard className="p-16 text-center max-w-2xl mx-auto flex flex-col items-center gap-8 mt-12">
            <div className="w-24 h-24 rounded-[2.5rem] bg-muted/30 flex items-center justify-center text-5xl">
              {search ? "🔍" : "📦"}
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                {search ? "No matching orders" : "No orders yet"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {search
                  ? "Try adjusting your search filters to find what you're looking for."
                  : "You haven't placed any orders yet. Start shopping and satisfy your cravings!"}
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </section>
  );
}

