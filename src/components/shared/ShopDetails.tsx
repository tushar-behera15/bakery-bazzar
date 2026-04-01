"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Star, MapPin, ShoppingCart, ChevronLeft } from "lucide-react";
import { IconChefHat, IconSparkles } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import GlassCard from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { emitCartUpdate } from "@/utils/cartEvents";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BASE_URL } from "@/lib/api";

import breadImage from "@/assets/bread.jpg";
import croissantImage from "@/assets/croissant.jpg";

interface Product {
    id: number;
    name: string;
    category: { name: string };
    price: number;
    images: { url: string }[];
    stock_quantity: number;
}

interface Shop {
    id: number;
    name: string;
    logo?: string;
    tagline: string;
    rating: number;
    address?: string;
    products: Product[];
}

export default function ShopDetails() {
    const { id } = useParams();
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<number | null>(null);

    const handleAddToCart = async (productId: number) => {
        try {
            setAddingId(productId);
            const res = await fetch(`${BASE_URL}/cart`, {

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
        const fetchShop = async () => {
            try {
                const res = await fetch(`${BASE_URL}/shop/${id}`);

                const data = await res.json();
                if (data.shop) {
                    setShop({
                        ...data.shop,
                        logo: data.shop.products?.[0]?.images?.[0]?.url || croissantImage.src,
                        tagline: data.shop.description || "Artisan breads & specialty pastries",
                        rating: 4.8,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch shop details:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchShop();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-20 px-4">
                    <Skeleton className="w-24 h-24 md:w-40 md:h-40 rounded-[2.5rem] bg-muted/30 shrink-0" />
                    <div className="flex-1 space-y-4 w-full md:w-auto text-center md:text-left">
                        <div className="flex gap-2 justify-center md:justify-start">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-32 rounded-full" />
                        </div>
                        <Skeleton className="h-10 md:h-16 w-3/4 rounded-2xl mx-auto md:mx-0" />
                        <Skeleton className="h-4 md:h-6 w-1/2 rounded-xl mx-auto md:mx-0" />
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-[2rem] border border-border/10 overflow-hidden bg-card/50">
                            <Skeleton className="aspect-[16/10] w-full" />
                            <div className="p-5 space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                                    <Skeleton className="h-3 w-1/4 rounded-md" />
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-border/10">
                                    <Skeleton className="h-8 w-16 rounded-lg" />
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <IconChefHat className="h-16 w-12 text-primary/20 mb-6" />
                <h2 className="text-2xl font-black mb-4">Shop Not Found</h2>
                <Link href="/shops">
                    <Button variant="outline" className="rounded-xl">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Shops
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Shop Header Section */}
            <div className="relative pt-12 pb-20 overflow-hidden w-full">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-1/2 h-full bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4">
                    <Link href="/shops" className="inline-flex items-center text-xs sm:text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8 group">
                        <ChevronLeft className="mr-1 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                        Back to all bakeries
                    </Link>

                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                        <div className="relative w-24 h-24 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 border-background shadow-premium shrink-0">
                            <Image 
                                src={shop.logo || croissantImage} 
                                alt={shop.name} 
                                fill 
                                sizes="(max-width: 768px) 96px, 160px"
                                className="object-cover" 
                            />
                        </div>
                        
                        <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4 w-full">
                            <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-2 md:gap-3">
                                <Badge className="bg-primary/10 text-primary border-none font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full flex items-center gap-1 md:gap-1.5 dark:bg-primary/20 w-fit">
                                    <Star className="h-3 md:h-3.5 w-3 md:w-3.5 fill-current" />
                                    <span className="text-[10px] md:text-sm">{shop.rating} Rated</span>
                                </Badge>
                                <Badge variant="outline" className="max-w-full sm:max-w-md border-border text-muted-foreground font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full flex items-center gap-1 md:gap-1.5 dark:border-white/10 dark:text-muted-foreground/80 w-fit">
                                    <MapPin className="h-3 md:h-3.5 w-3 md:w-3.5 shrink-0" />
                                    <span className="text-[10px] md:text-sm truncate">{shop.address || "Local Delivery"}</span>
                                </Badge>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">{shop.name}</h1>
                            <p className="text-sm md:text-xl text-muted-foreground font-medium max-w-2xl">{shop.tagline}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-24">
                <div className="flex items-center gap-4 mb-12">
                    <h2 className="text-2xl font-black text-foreground shrink-0 uppercase tracking-tight">Available Treats</h2>
                    <div className="h-[2px] flex-1 bg-linear-to-r from-primary/20 to-transparent rounded-full" />
                </div>

                {shop.products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {shop.products.map((product) => (
                            <GlassCard 
                                key={product.id} 
                                className={cn(
                                    "h-full group/card p-0 overflow-hidden border-primary/5 hover:border-primary/20 dark:border-white/5 dark:hover:border-white/10",
                                    product.stock_quantity === 0 && "grayscale contrast-125 brightness-90 opacity-80"
                                )} 
                                hover={product.stock_quantity > 0}
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={product.images?.[0]?.url || breadImage.src}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                    />
                                    
                                    {product.stock_quantity === 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                            <div className="px-6 py-2 bg-background/10 backdrop-blur-md border border-white/20 rounded-full">
                                                <span className="text-white font-black uppercase tracking-[0.2em] text-sm text-center">Out of Stock</span>
                                            </div>
                                        </div>
                                    )}

                                    <Badge
                                        className="absolute top-4 left-4 bg-background/80 blur-backdrop-sm border-none shadow-premium text-primary font-bold text-[10px] uppercase tracking-widest px-3 py-1"
                                    >
                                        {product.category?.name || "Baked"}
                                    </Badge>
                                </div>

                                <div className="p-5 space-y-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-foreground group-hover/card:text-primary transition-colors line-clamp-1">{product.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center text-amber-500 dark:text-amber-400">
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
                                            disabled={addingId === product.id || product.stock_quantity === 0}
                                            onClick={() => handleAddToCart(product.id)}
                                            className={cn(
                                                "h-10 w-10 rounded-xl transition-all duration-300",
                                                (addingId === product.id || product.stock_quantity === 0) ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" : "bg-primary text-primary-foreground shadow-soft hover:shadow-premium hover:-translate-y-1"
                                            )}
                                        >
                                            {addingId === product.id ? (
                                                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                            ) : (
                                                <ShoppingCart className="h-5 w-5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="text-4xl">🥐</div>
                        <h3 className="text-xl font-bold">No products available yet</h3>
                        <p className="text-muted-foreground">Check back later for fresh treats from this shop!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
