"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { emitCartUpdate } from "@/utils/cartEvents";
import { cn } from "@/lib/utils";
import { IconSearch, IconShoppingCart, IconSparkles, IconChefHat } from "@tabler/icons-react";
import GlassCard from "@/components/ui/glass-card";
import SectionTitle from "./SectionTitle";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    imageUrl: string;
}

interface Shop {
    id: number;
    name: string;
    products: Product[];
}

export default function ProductsPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<number | null>(null);

    const handleAddToCart = async (productId: number) => {
        try {
            setAddingId(productId);
            const res = await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId, quantity: 1 }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to add to cart");
            }
            emitCartUpdate();
            toast.success("Added to cart");
        } catch (error) {
            console.error("Add to cart failed:", error);
            toast.error("Failed to add to cart");
        } finally {
            setAddingId(null);
        }
    };

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/product");
                const data = await res.json();
                const grouped: { [key: number]: Shop } = {};
                data.forEach((product: any) => {
                    if (!grouped[product.shop.id]) {
                        grouped[product.shop.id] = {
                            id: product.shop.id,
                            name: product.shop.name,
                            products: [],
                        };
                    }
                    grouped[product.shop.id].products.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        category: product.category?.name || "Uncategorized",
                        imageUrl: product.images?.[0]?.url || "/placeholder.jpg",
                    });
                });
                setShops(Object.values(grouped));
            } catch (error) {
                console.error("Failed to fetch shops/products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const filteredShops = shops
        .map((shop) => ({
            ...shop,
            products: shop.products.filter(
                (p) =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase())
            ),
        }))
        .filter((shop) => shop.name.toLowerCase().includes(query.toLowerCase()) || shop.products.length > 0);

    return (
        <section className="py-12 md:py-20 bg-background min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 space-y-16">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <SectionTitle 
                            title="Bakery Collection" 
                            subtitle="Explore artisanal treats from the finest bakeshops" 
                            align="left"
                        />
                    </div>
                    
                    <div className="w-full md:w-[400px]">
                        <GlassCard className="p-1 px-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
                            <div className="relative flex items-center">
                                <IconSearch className="absolute left-4 h-5 w-5 text-muted-foreground/60" />
                                <Input
                                    placeholder="Search treats or shops..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="pl-12 pr-4 h-12 rounded-xl bg-transparent border-none text-foreground focus-visible:ring-0 shadow-none font-medium placeholder:text-muted-foreground/40"
                                />
                                {query && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setQuery("")}
                                        className="h-8 px-2 hover:bg-muted/50 rounded-lg mr-2"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-20">
                    {loading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={`shop-skeleton-${i}`} className="space-y-8 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-8 w-48 rounded-lg opacity-40" />
                                    <Skeleton className="h-1 flex-1 rounded opacity-20" />
                                </div>
                                <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 mask-fade-right">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <div key={`product-skeleton-${i}-${j}`} className="w-72 shrink-0">
                                            <Skeleton className="h-[360px] w-full rounded-2xl opacity-30" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : filteredShops.length > 0 ? (
                        filteredShops.map((shop) => (
                            <div key={`shop-${shop.id}`} className="group/shop">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                            <IconChefHat className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-black text-foreground tracking-tight group-hover/shop:text-primary transition-colors">
                                            {shop.name}
                                        </h2>
                                    </div>
                                    <div className="h-[2px] flex-1 bg-linear-to-r from-primary/20 to-transparent rounded-full" />
                                </div>

                                <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 scrollbar-hide">
                                    {shop.products.map((product) => (
                                        <div key={`product-${shop.id}-${product.id}`} className="w-[300px] shrink-0 snap-start">
                                            <GlassCard className="h-full group/card p-0 overflow-hidden border-primary/5 hover:border-primary/20" hover>
                                                <div className="relative aspect-4/3 overflow-hidden">
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                                                    
                                                    <Badge 
                                                        className="absolute top-4 left-4 bg-background/80 blur-backdrop-sm border-none shadow-premium text-primary font-bold text-[10px] uppercase tracking-widest px-3 py-1"
                                                    >
                                                        {product.category}
                                                    </Badge>
                                                    
                                                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-between">
                                                        <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
                                                            View Details
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-5 space-y-4">
                                                    <div>
                                                        <h4 className="font-bold text-lg text-foreground group-hover/card:text-primary transition-colors">{product.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center text-amber-500">
                                                                <IconSparkles className="h-3 w-3 fill-current" />
                                                                <span className="text-[10px] font-black uppercase tracking-wider ml-1">Handcrafted</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                                        <span className="text-2xl font-black text-foreground tracking-tighter">
                                                            ₹{product.price}
                                                        </span>
                                                        <Button
                                                            size="icon"
                                                            disabled={addingId === product.id}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleAddToCart(product.id);
                                                            }}
                                                            className={cn(
                                                                "h-10 w-10 rounded-xl transition-all duration-300",
                                                                addingId === product.id ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground shadow-soft hover:shadow-premium hover:-translate-y-1"
                                                            )}
                                                        >
                                                            {addingId === product.id ? (
                                                                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                                            ) : (
                                                                <IconShoppingCart className="h-5 w-5" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </div>
                                    ))}
                                    {/* Spacer for horizontal scroll padding */}
                                    <div className="w-4 shrink-0" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <GlassCard className="py-20 text-center flex flex-col items-center gap-6">
                            <div className="w-20 h-20 rounded-[2rem] bg-muted/30 flex items-center justify-center text-4xl grayscale opacity-50">
                                🍰
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">No treats found</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    We couldn't find any products matching "<strong>{query}</strong>". Try searching for something else!
                                </p>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => setQuery("")}
                                className="rounded-xl px-8"
                            >
                                Show All Products
                            </Button>
                        </GlassCard>
                    )}
                </div>
            </div>
        </section>
    );
}
