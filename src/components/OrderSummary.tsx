"use client";

import { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Receipt, Truck } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // Example 10% tax
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500

  return (
    <GlassCard className="h-fit sticky top-24 overflow-hidden border-border/40 p-0 shadow-premium bg-linear-to-b from-background/40 to-muted/20">
      <div className="bg-primary text-primary-foreground p-6">
        <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-widest">
          <Receipt className="w-6 h-6" />
          Order Summary
        </h3>
      </div>
      <div className="p-0">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Subtotal ({order.items.length} items)</span>
            <span className="font-semibold">Rs {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> Shipping
            </span>
            <span className="font-semibold">{shipping === 0 ? "FREE" : `Rs ${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span className="font-semibold">Rs {tax.toFixed(2)}</span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold">Total Amount</span>
            <span className="text-3xl font-black text-primary">
              Rs {(subtotal + tax + shipping).toFixed(2)}
            </span>
          </div>
        </div>

        {order.payment && (
          <div className="bg-muted/30 p-8 border-t border-border/40 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-black tracking-tight flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payment Status
              </h4>
              <Badge 
                variant={order.payment.status === 'SUCCESS' ? 'default' : 'secondary'}
                className={order.payment.status === 'SUCCESS' ? 'bg-green-600 font-bold uppercase tracking-widest' : 'font-bold uppercase tracking-widest'}
              >
                {order.payment.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground/60 uppercase font-black tracking-widest">Method</p>
                <p className="font-semibold text-sm">{order.payment.method}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground/60 uppercase font-black tracking-widest">Amount Paid</p>
                <p className="font-black text-lg text-foreground">Rs {order.payment.amount.toFixed(2)}</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
