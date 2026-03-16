"use client";

import { OrderItem } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Trash2, Package } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

interface OrderItemRowProps {
  item: OrderItem;
  onRemove?: (itemId: number) => void;
  isRemoving?: boolean;
}

export function OrderItemRow({ item, onRemove, isRemoving }: OrderItemRowProps) {
  return (
    <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 hover:shadow-premium transition-all duration-300 group gap-4 bg-muted/10 border-border/40" hover>
      <div className="flex items-center gap-6 w-full sm:w-auto">
        <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center shrink-0 border border-border/40 shadow-inner">
          <Package className="text-primary/70 w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-foreground text-lg tracking-tight">Product #{item.productId}</h4>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Qty: <span className="text-foreground font-black bg-muted px-2 py-0.5 rounded-md">{item.quantity}</span> 
            <span className="text-muted-foreground/40">×</span> 
            <span>Rs {item.price.toFixed(2)}</span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border/40">
        <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Subtotal</p>
            <p className="text-2xl font-black text-primary">
            Rs {(item.quantity * item.price).toFixed(2)}
            </p>
        </div>
        
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            disabled={isRemoving}
            className="w-12 h-12 rounded-xl text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20"
            title="Remove item"
          >
            <Trash2 className="w-6 h-6" />
          </Button>
        )}
      </div>
    </GlassCard>
  );
}

