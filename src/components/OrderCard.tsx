"use client";

import { Order } from "@/types/order";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { ShoppingBag, Calendar, CreditCard, ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <GlassCard className="hover:shadow-premium transition-all duration-300 overflow-hidden border-border/40 group p-0 flex flex-col h-full bg-linear-to-b from-background/40 to-muted/20">
      <div className="bg-muted/30 p-6 border-b border-border/40">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <h3 className="text-xl font-black flex items-center gap-2 tracking-tight">
              Order <span className="text-primary opacity-80">#{order.id}</span>
            </h3>
            <div className="flex items-center text-sm font-medium text-muted-foreground/80 gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(order.createdAt), "MMM d, yyyy")}
            </div>
          </div>
          <Badge className={`${statusColors[order.status]} font-black border uppercase tracking-widest text-[10px] px-3 py-1`}>
            {order.status}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-6 flex-grow">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-black">
              Total Amount
            </p>
            <p className="text-3xl font-black text-foreground tracking-tighter">
              ₹{order.totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-black">
              Items
            </p>
            <p className="text-xl font-bold flex items-center gap-2 text-foreground/80">
              <ShoppingBag className="w-5 h-5 text-primary" />
              {order.items?.length || 0} Products
            </p>
          </div>
        </div>
        
        {order.payment && (
          <div className="mt-6 pt-4 border-t border-dashed border-border/40 flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Paid via {order.payment.method}</span>
            <Badge variant="outline" className="ml-auto text-[10px] uppercase font-bold tracking-widest h-6 border-primary/20 bg-primary/5 text-primary">
              {order.payment.status}
            </Badge>
          </div>
        )}
      </CardContent>
      
      <div className="p-6 bg-muted/10 mt-auto border-t border-border/40">
        <Link href={`/orders/${order.id}`} className="w-full block">
          <Button variant="outline" className="w-full h-12 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all font-black text-base shadow-soft group-hover:shadow-premium flex items-center justify-center">
            View Order Details
            <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
