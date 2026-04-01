/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { emitCartUpdate } from "@/utils/cartEvents";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IconCreditCard, IconCash, IconShieldCheck, IconInfoCircle, IconTrash, IconMinus, IconPlus, IconShoppingCart, IconReceipt2, IconChefHat } from "@tabler/icons-react";
import GlassCard from "@/components/ui/glass-card";
import SectionTitle from "@/components/shared/SectionTitle";
import { useRouter } from "next/navigation";
import { api, BASE_URL } from "@/lib/api";

import { Order } from "@/types/order";
import { Loader2, Plus, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Address, CreateAddressInput } from "@/types/address";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
        stock_quantity: number;
        shopName: string;
    };
}

export default function CartPage() {
    const queryClient = useQueryClient();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPlacing, setIsPlacing] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<"UPI" | "CASH">("UPI");
    const [placingMethod, setPlacingMethod] = useState<"UPI" | "CASH" | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [addressFormData, setAddressFormData] = useState<Partial<CreateAddressInput>>({
        label: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        phone: "",
    });

    const router = useRouter();
    const { user } = useAuth();

    // Fetch user addresses
    const { data: addresses = [], isLoading: addressesLoading } = useQuery<Address[]>({
        queryKey: ["user-addresses", user?.id],
        queryFn: async () => {
            return await api.get<Address[]>(`/addresses/user/${user?.id}`, { credentials: "include" })
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
    });

    // Automatically select first address if available
    useEffect(() => {
        if (addresses.length > 0 && selectedAddressId === null) {
            setSelectedAddressId(addresses[0].id);
        }
    }, [addresses, selectedAddressId]);

    const addAddressMutation = useMutation({
        mutationFn: async (data: Partial<CreateAddressInput>) => {
            return await api.post<Address>("/addresses", { ...data, userId: user?.id })
        },
        onSuccess: (newAddress) => {
            queryClient.invalidateQueries({ queryKey: ["user-addresses", user?.id] })
            setSelectedAddressId(newAddress.id)
            setIsAddressDialogOpen(false)
            toast.success("Address added successfully")
        },
        onError: () => toast.error("Failed to add address")
    });

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        addAddressMutation.mutate(addressFormData);
    };

    const fetchCart = async () => {
        try {
            const res = await fetch(`${BASE_URL}/cart`, {

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
            await fetch(`${BASE_URL}/cart/${cartId}`, {

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
            await fetch(`${BASE_URL}/cart/${cartId}`, {

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

    const handlePlaceOrder = async (method: "UPI" | "CASH" = "UPI") => {
        if (cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        if (!user?.id) {
            toast.error("You must be logged in to place an order");
            return;
        }

        if (!selectedAddressId) {
            toast.error("Please select a delivery address.");
            return;
        }

        setIsPlacing(true);
        setPlacingMethod(method);
        try {
            const idempotencyKey = crypto.randomUUID();

            // 1. Create Order and Payment in Backend
            const order = await api.post<Order & { razorpay_order_id: string, key_id: string }>("/orders", {
                buyerId: user.id,
                addressId: selectedAddressId,
                paymentMethod: method, // Original
                method: method,        // Alternative 1
                payment_method: method, // Alternative 2
                items: cart.map(i => ({
                    productId: i.product.id,
                    price: i.product.price,
                    quantity: i.quantity
                })),
                idempotencyKey
            });

            // 2. Extract Order ID safely (handles both flat and nested responses)
            const getOrderId = (obj: any) => {
                if (!obj) return null;
                return obj.id || obj._id || obj.orderId || obj.order_id ||
                    obj.order?.id || obj.order?._id || obj.order?.orderId ||
                    obj.data?.id || obj.data?._id || obj.data?.order?.id;
            };

            const orderId = getOrderId(order);

            // 3. Handle Payment logic based on method
            if (method === "CASH") {
                if (!orderId) {
                    console.error("Order creation returned no ID:", order);
                    toast.error("Order placed, but we couldn't find the ID. Please check 'My Orders'.");
                    return;
                }
                toast.success("Order request sent! Awaiting seller approval.");
                router.push(`/orders/${orderId}`);
                return;
            } else {
                // 4. Initialize Razorpay Checkout (UPI only)
                const options = {
                    key: order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: total * 100,
                    currency: "INR",
                    name: "Bakery Bazzar",
                    description: `Order #${orderId}`,
                    order_id: order.razorpay_order_id,
                    handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
                        try {
                            // Verify Payment in Backend
                            const verifyRes = await api.post<any>("/payments/verify", {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });

                            toast.success("Payment successful! Order placed.");

                            // Try to get ID from verify response first, then original order
                            const finalOrderId = getOrderId(verifyRes) || getOrderId(order);

                            if (finalOrderId) {
                                router.push(`/orders/${finalOrderId}`);
                            } else {
                                console.error("Could not determine Order ID after payment", { order, verifyRes });
                                toast.error("Payment successful, but we couldn't find your order. Please check 'My Orders'.");
                                router.push("/orders");
                            }
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
            }

        } catch (error) {
            console.error("Order placement failed:", error);
            toast.error("Failed to place order.");
        } finally {
            setIsPlacing(false);
            setPlacingMethod(null);
        }
    };

    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <section className="py-12 md:py-20 bg-background min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 dark:bg-accent/10 rounded-full blur-[120px]" />
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
                                                    <div className={cn(
                                                        "relative h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden shadow-soft border border-border/40 shrink-0",
                                                        item.product.stock_quantity === 0 && "grayscale contrast-125 brightness-90 opacity-80"
                                                    )}>
                                                        <Image
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            fill
                                                            sizes="128px"
                                                            className="object-cover"
                                                        />
                                                        {item.product.stock_quantity === 0 && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                                                <span className="text-white font-black uppercase tracking-tighter text-[10px] text-center px-1">Out of Stock</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 text-center md:text-left space-y-1">
                                                        <h3 className="text-xl font-black text-foreground tracking-tight">
                                                            {item.product.name}
                                                        </h3>
                                                        <p className="text-sm font-bold text-primary flex items-center gap-1">
                                                            <IconChefHat className="h-4 w-4" />
                                                            {item.product.shopName}
                                                        </p>
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
                                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 dark:text-muted-foreground/80">Subtotal</p>
                                                            <p className="text-xl font-black text-foreground dark:text-white">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                </GlassCard>

                                {/* 📍 Address Selection */}
                                <GlassCard className="p-0 border-none overflow-hidden mt-6">
                                    <div className="p-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Delivery Address
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsAddressDialogOpen(true)}
                                            className="text-primary hover:text-primary/80 hover:bg-primary/5 font-bold gap-2"
                                        >
                                            <Plus className="h-4 w-4" /> Add New
                                        </Button>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {addressesLoading ? (
                                            <div className="space-y-4">
                                                <Skeleton className="h-24 w-full rounded-2xl" />
                                                <Skeleton className="h-24 w-full rounded-2xl" />
                                            </div>
                                        ) : addresses.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {addresses.map((addr) => (
                                                    <div
                                                        key={addr.id}
                                                        onClick={() => setSelectedAddressId(addr.id)}
                                                        className={cn(
                                                            "relative p-4 rounded-2xl cursor-pointer transition-all border-2",
                                                            selectedAddressId === addr.id
                                                                ? "bg-primary/5 border-primary shadow-soft"
                                                                : "bg-background/50 border-transparent hover:border-border/60"
                                                        )}
                                                    >
                                                        {selectedAddressId === addr.id && (
                                                            <div className="absolute top-3 right-3 text-primary animate-in zoom-in-50">
                                                                <CheckCircle2 className="h-5 w-5 fill-background" />
                                                            </div>
                                                        )}
                                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{addr.label || "Address"}</p>
                                                        <p className="font-bold text-foreground leading-tight">{addr.line1}</p>
                                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                                            {addr.city}, {addr.state} - {addr.postalCode}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-muted/20 rounded-2xl border-2 border-dashed border-border/40">
                                                <p className="text-muted-foreground font-medium mb-3">No saved addresses</p>
                                                <Button size="sm" onClick={() => setIsAddressDialogOpen(true)}>
                                                    Add your first address
                                                </Button>
                                            </div>
                                        )}
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
                                                    Amount ({cart.length} items)
                                                </span>
                                                <span className="font-bold text-foreground">₹{total.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t-2 border-dashed border-border/40">
                                            <div className="flex justify-between items-end mb-8">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 dark:text-muted-foreground/80">Total Amount</p>
                                                    <p className="text-4xl font-black text-foreground dark:text-white tracking-tighter">₹{total.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            {cart.some(i => i.product.stock_quantity === 0) && (
                                                <div className="mb-6 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                                                    Some items are currently out of stock. Please remove them to proceed.
                                                </div>
                                            )}

                                            <Tabs defaultValue="UPI" onValueChange={(v) => setSelectedMethod(v as "UPI" | "CASH")} className="w-full">
                                                <TabsList className="grid grid-cols-2 w-full h-12 bg-muted/50 rounded-xl p-1 mb-6 border border-border/40">
                                                    <TabsTrigger value="UPI" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-[10px] uppercase tracking-widest gap-2">
                                                        <IconCreditCard className="w-4 h-4" />
                                                        Online Pay
                                                    </TabsTrigger>
                                                    <TabsTrigger value="CASH" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-[10px] uppercase tracking-widest gap-2">
                                                        <IconCash className="w-4 h-4" />
                                                        Cash Pay
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="UPI" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                                                        <IconShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Secure Razorpay Checkout</p>
                                                            <p className="text-[10px] text-muted-foreground font-medium">Supports UPI, All Cards, Net Banking & Wallets. Instant verification.</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => handlePlaceOrder("UPI")}
                                                        disabled={isPlacing || cart.length === 0 || cart.some(i => i.product.stock_quantity === 0) || !selectedAddressId}
                                                        className="w-full h-14 rounded-2xl text-lg font-black tracking-tight shadow-soft hover:shadow-premium bg-linear-to-br from-primary to-primary/80 transition-all group"
                                                    >
                                                        {placingMethod === "UPI" ? (
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
                                                </TabsContent>

                                                <TabsContent value="CASH" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                                                        <IconInfoCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Manual Payment Approval</p>
                                                            <p className="text-[10px] text-muted-foreground font-medium">Pay directly at the shop counter. Order status will be updated after seller approval.</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handlePlaceOrder("CASH")}
                                                        disabled={isPlacing || cart.length === 0 || cart.some(i => i.product.stock_quantity === 0) || !selectedAddressId}
                                                        className="w-full h-14 rounded-2xl text-lg font-black tracking-tight border-2 hover:bg-primary/5 transition-all text-foreground"
                                                    >
                                                        {placingMethod === "CASH" ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                                Requesting Cash Pay...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Place Cash Order
                                                                <IconCash className="ml-2 h-5 w-5" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </TabsContent>
                                            </Tabs>

                                            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest mt-6">
                                                Secure payment processed via Stripe
                                            </p>

                                        </div>
                                    </div>
                                </GlassCard>

                                {/* 
                                <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <IconTruck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-primary">Free Delivery</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">On orders above ₹500</p>
                                    </div>
                                </div>
                                */}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 🆕 Add Address Dialog */}
            <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">Add New Address</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddAddress} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="label" className="font-bold">Label (e.g. Home, Office)</Label>
                                <Input
                                    id="label"
                                    placeholder="Home"
                                    className="rounded-xl border-border/60"
                                    value={addressFormData.label}
                                    onChange={(e) => setAddressFormData({ ...addressFormData, label: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="line1" className="font-bold">Address Line 1</Label>
                                <Input
                                    id="line1"
                                    placeholder="Street address, P.O. box"
                                    required
                                    className="rounded-xl border-border/60"
                                    value={addressFormData.line1}
                                    onChange={(e) => setAddressFormData({ ...addressFormData, line1: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city" className="font-bold">City</Label>
                                <Input
                                    id="city"
                                    required
                                    className="rounded-xl border-border/60"
                                    value={addressFormData.city}
                                    onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state" className="font-bold">State</Label>
                                <Input
                                    id="state"
                                    required
                                    className="rounded-xl border-border/60"
                                    value={addressFormData.state}
                                    onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalCode" className="font-bold">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    required
                                    className="rounded-xl border-border/60"
                                    value={addressFormData.postalCode}
                                    onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="font-bold">Phone</Label>
                                <Input
                                    id="phone"
                                    placeholder="Delivery contact"
                                    className="rounded-xl border-border/60"
                                    value={addressFormData.phone}
                                    onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsAddressDialogOpen(false)} className="rounded-xl font-bold">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={addAddressMutation.isPending} className="rounded-xl font-bold px-8 shadow-soft">
                                {addAddressMutation.isPending ? "Saving..." : "Save Address"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
