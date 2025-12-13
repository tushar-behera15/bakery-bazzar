"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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

    // 🔹 Fetch cart
    const fetchCart = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/cart", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to load cart");

            const data = await res.json();
            setCart(data);
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

    // 🔹 Update quantity
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
        } catch {
            toast.error("Failed to update quantity");
        }
    };

    // 🔹 Remove item
    const removeItem = async (cartId: number) => {
        try {
            await fetch(`http://localhost:5000/api/cart/${cartId}`, {
                method: "DELETE",
                credentials: "include",
            });

            setCart((prev) => prev.filter((item) => item.id !== cartId));
            toast.success("Item removed");
        } catch {
            toast.error("Failed to remove item");
        }
    };

    // 🔹 Calculations
    const subtotal = cart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    const taxes = subtotal * 0.05;
    const delivery = subtotal >= 500 ? 0 : 20;
    const total = subtotal + taxes + delivery;

    return (
        <section className="py-16 bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-primary">Your Cart</h1>
                <p className="text-muted-foreground mt-1 mb-8">
                    Review your items before checkout 🍰
                </p>

                {loading ? (
                    <Skeleton className="h-64 w-full rounded-xl" />
                ) : cart.length === 0 ? (
                    <Card className="p-10 text-center">
                        <ShoppingCart className="h-16 w-16 mx-auto text-muted mb-4" />
                        <h2 className="text-xl font-semibold">Your cart is empty</h2>
                        <p className="text-muted-foreground mt-2">
                            Looks like you haven’t added anything yet.
                        </p>
                        <Button className="mt-6">Browse Products</Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 🛒 Cart Items */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Cart Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="max-h-[480px] pr-4">
                                    <div className="space-y-6">
                                        {cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 p-4 border rounded-xl hover:bg-secondary transition"
                                            >
                                                <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={item.product.imageUrl}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="font-semibold">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="text-primary font-bold text-lg">
                                                        ₹{item.product.price}
                                                    </p>

                                                    <div className="flex items-center gap-3 mt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity - 1)
                                                            }
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>

                                                        <span>{item.quantity}</span>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity + 1)
                                                            }
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* 🧾 Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Taxes (5%)</span>
                                    <span>₹{taxes.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span>₹{delivery}</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">
                                        ₹{total.toFixed(2)}
                                    </span>
                                </div>

                                <Button className="w-full text-lg py-6">
                                    Proceed to Checkout
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </section>
    );
}
