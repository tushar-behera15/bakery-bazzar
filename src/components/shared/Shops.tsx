"use client";

import { useEffect, useState } from "react";
import { IconChefHat, IconMapPin } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import GlassCard from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGeolocation } from "@/hooks/useGeolocation";
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
    distance?: number | null;
}

interface Shop {
    id: number;
    name: string;
    logo: string;
    tagline: string;
    rating: number;
    address?: string;
    distance?: number | null;
}

export default function ShopsPage() {
    const { latitude, longitude } = useGeolocation();
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [radius, setRadius] = useState<string>("all");

    useEffect(() => {
        const fetchShops = async () => {
            setLoading(true);
            try {
                const url = "http://localhost:5000/api/shop?";
                const params = new URLSearchParams();
                
                if (latitude && longitude) {
                    params.append("lat", latitude.toString());
                    params.append("lng", longitude.toString());
                }
                
                if (radius !== "all") {
                    params.append("radius", radius);
                }

                const res = await fetch(url + params.toString());
                const data = await res.json();
                if (data.shops) {
                    const mappedShops: Shop[] = data.shops.map((s: RawShop) => ({
                        id: s.id,
                        name: s.name,
                        logo: s.products?.[0]?.images?.[0]?.url || croissantImage.src,
                        tagline: s.description || "Artisan breads & specialty pastries",
                        rating: 4.8,
                        address: s.address,
                        distance: s.distance,
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
    }, [latitude, longitude, radius]);

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

                {/* Proximity Filter */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-primary/5 p-6 rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <IconMapPin className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-foreground">Location-based Search</h4>
                            <p className="text-xs text-muted-foreground">
                                {latitude ? "Showing bakeries near you" : "Share location for proximity sorting"}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Search Radius:</span>
                        <Select value={radius} onValueChange={setRadius}>
                            <SelectTrigger className="w-full md:w-[180px] bg-background/50 backdrop-blur-sm border-primary/10">
                                <SelectValue placeholder="Select radius" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Distances</SelectItem>
                                <SelectItem value="5">Within 5 km</SelectItem>
                                <SelectItem value="10">Within 10 km</SelectItem>
                                <SelectItem value="20">Within 20 km</SelectItem>
                                <SelectItem value="50">Within 50 km</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                                distance={shop.distance}
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
