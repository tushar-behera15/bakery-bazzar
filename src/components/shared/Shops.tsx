"use client";

import { useEffect, useState } from "react";
import { IconChefHat } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import GlassCard from "@/components/ui/glass-card";
import SectionTitle from "./SectionTitle";
import ShopCard from "./ShopCard";
import croissantImage from "@/assets/croissant.jpg";

interface ProductImage {
    url: string;
}

interface Product {
    images: ProductImage[];
}

interface RawShop {
    id: number;
    name: string;
    description?: string;
    address?: string;
    products?: Product[];
}

interface Shop {
    id: number;
    name: string;
    logo: string;
    tagline: string;
    rating: number;
    address?: string;
}

export default function ShopsPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/shop");
                const data = await res.json();
                if (data.shops) {
                    const mappedShops: Shop[] = data.shops.map((s: RawShop) => ({
                        id: s.id,
                        name: s.name,
                        logo: s.products?.[0]?.images?.[0]?.url || croissantImage.src,
                        tagline: s.description || "Artisan breads & specialty pastries",
                        rating: 4.8,
                        address: s.address,
                    }));
                    setShops(mappedShops);
                }
            } catch (error) {
                console.error("Failed to fetch shops:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    return (
        <section className="py-12 md:py-20 bg-background min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 space-y-16">
                <div className="text-center">
                    <SectionTitle
                        title="Our Partner Bakeries"
                        subtitle="Discover the finest local artisans bringing you freshly baked joy"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <GlassCard key={i} className="p-0 overflow-hidden border-primary/5">
                                <Skeleton className="aspect-video w-full" />
                                <div className="p-6 space-y-4">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-10 w-full rounded-xl" />
                                </div>
                            </GlassCard>
                        ))
                    ) : shops.length > 0 ? (
                        shops.map((shop) => (
                            <ShopCard 
                                key={shop.id}
                                id={shop.id}
                                name={shop.name}
                                logo={shop.logo}
                                tagline={shop.tagline}
                                rating={shop.rating}
                                address={shop.address}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <IconChefHat className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-foreground">No bakeries found</h3>
                            <p className="text-muted-foreground">We&apos;re currently onboarding more artisans. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
