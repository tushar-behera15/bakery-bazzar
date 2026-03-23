/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { emitCartUpdate } from "@/utils/cartEvents";
import { IconTrash, IconMinus, IconPlus, IconShoppingCart, IconReceipt2, IconTruck, IconPercentage } from "@tabler/icons-react";
import GlassCard from "@/components/ui/glass-card";
import SectionTitle from "@/components/shared/SectionTitle";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Order } from "@/types/order";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
    };
}

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPlacing, setIsPlacing] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const fetchCart = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/cart", {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to load cart");
            const data = await res.json();
            setCart(data.items || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (cartId: number, quantity: number) => {
        if (quantity < 1) return;
        try {
            await fetch(`http://localhost:5000/api/cart/${cartId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ quantity }),
            });
            setCart((prev) =>
                prev.map((item) =>
                    item.id === cartId ? { ...item, quantity } : item
                )
            );
            emitCartUpdate();
        } catch {
            toast.error("Failed to update quantity");
        }
    };

    const removeItem = async (cartId: number) => {
        try {
            await fetch(`http://localhost:5000/api/cart/${cartId}`, {
                method: "DELETE",
                credentials: "include",
            });
            setCart((prev) => prev.filter((item) => item.id !== cartId));
            emitCartUpdate();
            toast.success("Item removed from cart");
        } catch {
            toast.error("Failed to remove item");
        }
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        if (!user?.id) {
            toast.error("You must be logged in to place an order");
            return;
        }

        setIsPlacing(true);
        try {
            // 1. Create Order and Payment in Backend
            const order = await api.post<Order & { razorpay_order_id: string, key_id: string }>("/orders", {
                buyerId: user.id,
                addressId: 1, // Mock address ID
                items: cart.map(i => ({
                    productId: i.product.id,
                    price: i.product.price,
                    quantity: i.quantity
                }))
            });

            // 2. Initialize Razorpay Checkout
            const options = {
                key: order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: total * 100,
                currency: "INR",
                name: "Bakery Bazzar",
                description: `Order #${order.id}`,
                order_id: order.razorpay_order_id,
                handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
                    try {
                        // 3. Verify Payment in Backend
                        await api.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        toast.success("Payment successful! Order placed.");
                        router.push(`/orders/${order.id}`);
                    } catch (err) {
                        console.error("Payment verification failed:", err);
                        toast.error("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user.name || "",
                    email: user.email || "",
                },
                theme: {
                    color: "#f97316", // Primary color
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: { error: { description: string } }) {
                toast.error(`Payment failed: ${response.error.description}`);
            });
            rzp.open();

        } catch (error) {
            console.error("Order placement failed:", error);
            toast.error("Failed to place order.");
        } finally {
            setIsPlacing(false);
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const taxes = subtotal * 0.05;
    const delivery = subtotal >= 500 ? 0 : 14;
    const total = subtotal + taxes + delivery;

    return (
        <section className="py-12 md:py-20 bg-background min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle
                    title="Your Shopping Cart"
                    subtitle="Review your treats and prepare for checkout"
                    align="left"
                />

                <div className="mt-12">
                    {loading ? (
                        <div className="space-y-6">
                            <Skeleton className="h-64 w-full rounded-[2rem] opacity-30" />
                        </div>
                    ) : cart.length === 0 ? (
                        <GlassCard className="p-16 text-center max-w-2xl mx-auto flex flex-col items-center gap-8">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-muted/30 flex items-center justify-center text-5xl">
                                🥯
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-black text-foreground tracking-tight">Your cart is empty</h2>
                                <p className="text-muted-foreground text-lg">
                                    Looks like you haven&apos;t added any treats yet. Let&apos;s find something delicious!
                                </p>
                            </div>
                            <Button className="h-12 px-8 rounded-xl font-bold text-base shadow-soft hover:shadow-premium transition-all">
                                Browse Bakery Items
                            </Button>
                        </GlassCard>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* 🛒 Cart Items */}
                            <div className="lg:col-span-8 space-y-6">
                                <GlassCard className="p-0 border-none overflow-hidden">
                                    <div className="p-6 border-b border-border/40 bg-muted/30">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                            <IconShoppingCart className="h-5 w-5" />
                                            Selected Items ({cart.length})
                                        </h3>
                                    </div>
                                    <div className="p-2 md:p-6 space-y-4">
                                        {cart.map((item) => (
                                            <GlassCard
                                                key={item.id}
                                                className="p-4 md:p-6 border-primary/5 hover:border-primary/20 transition-all duration-300"
                                                hover
                                            >
                                                <div className="flex flex-col md:flex-row items-center gap-6">
                                                    <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden shadow-soft border border-border/40 shrink-0">
                                                        <Image
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1 text-center md:text-left space-y-1">
                                                        <h3 className="text-xl font-black text-foreground tracking-tight">
                                                            {item.product.name}
                                                        </h3>
                                                        <p className="text-2xl font-black text-primary">
                                                            ₹{item.product.price}
                                                        </p>

                                                        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                                            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/40">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-9 w-9 rounded-lg hover:bg-background hover:shadow-sm"
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                >
                                                                    <IconMinus className="h-4 w-4" />
                                                                </Button>
                                                                <span className="w-10 text-center font-black text-lg">{item.quantity}</span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-9 w-9 rounded-lg hover:bg-background hover:shadow-sm"
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                >
                                                                    <IconPlus className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-center md:items-end justify-between self-stretch gap-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-11 w-11 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive md:order-last"
                                                            onClick={() => removeItem(item.id)}
                                                        >
                                                            <IconTrash className="h-6 w-6" />
                                                        </Button>

                                                        <div className="text-right">
                                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Subtotal</p>
                                                            <p className="text-xl font-black text-foreground">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>

                            {/* 🧾 Order Summary */}
                            <div className="lg:col-span-4 lg:sticky lg:top-24">
                                <GlassCard className="p-0 border-primary/10 shadow-premium">
                                    <div className="p-6 border-b border-border/40 bg-muted/30">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                            <IconReceipt2 className="h-5 w-5" />
                                            Order Summary
                                        </h3>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground font-medium flex items-center gap-2">
                                                    Subtotal
                                                </span>
                                                <span className="font-bold text-foreground">₹{subtotal.toFixed(2)}</span>
                                            </div>

                                            <div className="flex justify-between items-center text-green-600">
                                                <span className="font-medium flex items-center gap-2">
                                                    <IconPercentage className="h-4 w-4" />
                                                    Taxes (5%)
                                                </span>
                                                <span className="font-bold">₹{taxes.toFixed(2)}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground font-medium flex items-center gap-2">
                                                    <IconTruck className="h-4 w-4" />
                                                    Delivery
                                                </span>
                                                <span className={cn("font-bold", delivery === 0 ? "text-green-600" : "text-foreground")}>
                                                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t-2 border-dashed border-border/40">
                                            <div className="flex justify-between items-end mb-8">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Total Amount</p>
                                                    <p className="text-4xl font-black text-foreground tracking-tighter">₹{total.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handlePlaceOrder}
                                                disabled={isPlacing || cart.length === 0}
                                                className="w-full h-14 rounded-2xl text-lg font-black tracking-tight shadow-soft hover:shadow-premium bg-linear-to-br from-primary to-primary/80 transition-all group"
                                            >
                                                {isPlacing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Placing Order...
                                                    </>
                                                ) : (
                                                    <>
                                                        Secure Checkout
                                                        <IconShoppingCart className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </Button>

                                            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest mt-6">
                                                Secure payment processed via Stripe
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>

                                <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <IconTruck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-primary">Free Delivery</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">On orders above ₹500</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
