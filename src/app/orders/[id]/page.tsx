/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, use } from "react";
import { Order } from "@/types/order";
import { api } from "@/lib/api";
import { OrderItemRow } from "@/components/OrderItemRow";
import { OrderSummary } from "@/components/OrderSummary";
import { AddItemForm } from "@/components/AddItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Package, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import GlassCard from "@/components/ui/glass-card";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchOrderDetails = async () => {
    try {
      const data = await api.get<Order>(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast.error("Could not load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleRemoveItem = async (itemId: number) => {
    setRemovingId(itemId);
    try {
      await api.delete(`/order-items/${itemId}`);
      toast.success("Item removed from order");
      fetchOrderDetails(); // Refresh list and totals
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <AlertCircle className="w-20 h-20 text-destructive mx-auto" />
          <h1 className="text-3xl font-bold">Order Not Found</h1>
          <p className="text-muted-foreground">The order you are looking for does not exist or has been removed.</p>
          <Link href="/orders">
            <Button size="lg" className="w-full">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-background min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground font-black uppercase tracking-widest mb-10">
          <Link href="/orders" className="hover:text-primary transition-colors">Orders</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <span className="text-foreground">Order #{order.id}</span>
        </nav>

        <div className="flex flex-col xl:flex-row gap-12">
          <div className="flex-1 space-y-12">

            <GlassCard className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-8 sm:p-10 border-primary/10 bg-linear-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-premium shrink-0">
                  <Package className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-4xl font-black tracking-tighter">Order <span className="text-primary opacity-80">#{order.id}</span></h1>
                  <p className="text-muted-foreground font-medium flex items-center gap-2">
                    Placed on <span className="text-foreground tracking-tight">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>

              <Link href="/orders">
                <Button variant="outline" className="w-full sm:w-auto rounded-xl h-14 px-8 font-black text-base shadow-soft hover:shadow-premium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group mt-3">
                  <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                  Back to Orders
                </Button>
              </Link>
            </GlassCard>

            <section className="space-y-8">
              <div className="flex items-center justify-between border-b-2 border-dashed border-border/40 pb-6">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  Items in this Order
                </h2>
                <span className="text-sm font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                  {order.items.length} Products
                </span>
              </div>

              <div className="grid gap-6">
                {order.items.length > 0 ? (
                  order.items.map((item) => (
                    <OrderItemRow
                      key={item.id}
                      item={item}
                      onRemove={handleRemoveItem}
                      isRemoving={removingId === item.id}
                    />
                  ))
                ) : (
                  <GlassCard className="py-16 text-center border-dashed border-muted-foreground/30 text-muted-foreground space-y-4">
                    <p className="text-lg">No items in this order.</p>
                    <p className="text-sm">Use the form below to add some yummy treats!</p>
                  </GlassCard>
                )}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-black tracking-tight border-b-2 border-dashed border-border/40 pb-6">Modify Order</h2>
              <AddItemForm orderId={order.id} onSuccess={fetchOrderDetails} />
            </section>
          </div>

          <aside className="w-full xl:w-[420px] shrink-0">
            <OrderSummary order={order} />
          </aside>
        </div>
      </div>
    </section>
  );
}
