"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import GlassCard from "@/components/ui/glass-card";

interface AddItemFormProps {
  orderId: number;
  onSuccess: () => void;
}

export function AddItemForm({ orderId, onSuccess }: AddItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    price: "",
    quantity: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.price || !formData.quantity) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/order-items", {
        orderId,
        productId: Number(formData.productId),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      });
      toast.success("Item added successfully");
      setFormData({ productId: "", price: "", quantity: "1" });
      onSuccess();
    } catch (error) {
      toast.error("Failed to add item");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-8 border-primary/20 bg-linear-to-b from-primary/5 to-transparent relative overflow-hidden group border-dashed" hover>
      <div className="absolute top-0 right-0 p-4 opacity-10 text-primary pointer-events-none group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-24 h-24" />
      </div>
      
      <h3 className="text-xl font-black mb-6 flex items-center gap-2 tracking-tight">
        <span className="p-2 bg-primary/10 rounded-xl text-primary">
          <Plus className="w-5 h-5" />
        </span>
        Quick Add Product
      </h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative z-10">
        <div className="space-y-2">
          <Label htmlFor="productId" className="font-bold text-muted-foreground/80 uppercase tracking-widest text-[10px]">Product ID</Label>
          <Input
            id="productId"
            placeholder="e.g. 101"
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            className="bg-background/80 h-12 rounded-xl focus-visible:ring-primary/40 shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="font-bold text-muted-foreground/80 uppercase tracking-widest text-[10px]">Price (Rs)</Label>
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="bg-background/80 h-12 rounded-xl focus-visible:ring-primary/40 shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity" className="font-bold text-muted-foreground/80 uppercase tracking-widest text-[10px]">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="bg-background/80 h-12 rounded-xl focus-visible:ring-primary/40 shadow-sm"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full font-black text-sm h-12 rounded-xl shadow-soft hover:shadow-premium transition-all">
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          Add Item
        </Button>
      </form>
    </GlassCard>
  );
}
