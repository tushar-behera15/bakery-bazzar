/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Receipt, Truck, Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handlePayNow = async () => {
    if (!user) {
      toast.error("Please login to pay");
      return;
    }

    setIsPaying(true);
    try {
      // 1. Create/Get Razorpay Order from Backend
      // The backend createPayment endpoint uses upsert, so it will return existing or new order
      const paymentData = await api.post<{ razorpay_order_id: string; key_id: string; amount: number }>(`/payments`, {
        orderId: order.id,
        amount: order.totalAmount,
        method: "UPI", // Default or could be selected
      });

      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount * 100,
        currency: "INR",
        name: "Bakery Bazzar",
        description: `Order #${order.id}`,
        order_id: paymentData.razorpay_order_id,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful!");
            router.refresh(); // Refresh to show paid status
          } catch (err) {
            console.error(err);
            toast.error("Verification failed");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#f97316",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    } finally {
      setIsPaying(false);
    }
  };

  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // Example 10% tax
  const shipping = subtotal > 500 ? 0 : 14; // Free shipping over 500

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

            {order.payment.status === 'PENDING' && (
              <Button
                onClick={handlePayNow}
                className="w-full h-12 rounded-xl font-black text-base shadow-soft hover:shadow-premium bg-primary text-primary-foreground transition-all mt-4"
                disabled={isPaying}
              >
                {isPaying ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                Pay Now
              </Button>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
