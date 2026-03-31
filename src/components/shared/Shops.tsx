"use client";

import { useState, useRef } from "react";
import { IconChefHat, IconMapPin } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGeolocation } from "@/hooks/useGeolocation";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import SectionTitle from "./SectionTitle";
import ShopCard from "./ShopCard";
import croissantImage from "@/assets/croissant.jpg";
import { RawShop } from "@/types/shop";

import { Button } from "@/components/ui/button";
import { calculateDistance } from "@/utils/geo";

// Remove local interface definitions as they are now imported

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
    const { latitude, longitude, accuracy, refresh, refreshId } = useGeolocation();
    const [radius, setRadius] = useState<string>("all");
    
    // Track the location used for the last server fetch
    const lastFetchedLocation = useRef<{ lat: number; lng: number } | null>(null);

    const { data: shops = [], isLoading: loading } = useQuery<Shop[]>({
        queryKey: ["shops", latitude, longitude, radius, refreshId],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (latitude && longitude) {
                params.append("lat", latitude.toString());
                params.append("lng", longitude.toString());
            }
            if (radius !== "all") {
                params.append("radius", radius);
            }
            const endpoint = `/shop?${params.toString()}`;
            const data = await api.get<{ shops: RawShop[] }>(endpoint);
            if (latitude && longitude) {
                lastFetchedLocation.current = { lat: latitude, lng: longitude };
            }
            return data.shops.map((s: RawShop) => {
                let distance = s.distance;
                if (latitude && longitude && s.latitude && s.longitude) {
                    distance = calculateDistance(latitude, longitude, s.latitude, s.longitude);
                }
                return {
                    id: s.id,
                    name: s.name,
                    logo: s.products?.[0]?.images?.[0]?.url || croissantImage.src,
                    tagline: s.description || "Artisan breads & specialty pastries",
                    rating: 4.8,
                    address: s.address,
                    distance: distance,
                };
            });
        },
    });

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
                            <p className={cn(
                                "text-xs font-medium",
                                !latitude ? "text-amber-500" : "text-muted-foreground"
                            )}>
                                {latitude ? "Showing bakeries near you" : "Enable location for proximity sorting"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Search Radius:</span>
                            {accuracy && accuracy > 2000 && (
                                <span className="text-[10px] font-bold text-amber-500 animate-pulse">
                                    Low Accuracy (±{(accuracy / 1000).toFixed(1)}km)
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
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
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-xl border-primary/10 shrink-0"
                                onClick={refresh}
                                title="Refresh Location"
                            >
                                <IconMapPin className={cn("h-4 w-4", !latitude && "animate-bounce")} />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-3xl border border-border/10 overflow-hidden bg-card/50 px-0">
                                <Skeleton className="aspect-video w-full" />
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-7 w-3/4 rounded-lg" />
                                        <Skeleton className="h-4 w-full rounded-md" />
                                        <Skeleton className="h-4 w-2/3 rounded-md" />
                                    </div>
                                    <Skeleton className="h-4 w-1/2 rounded-md" />
                                    <div className="pt-4 border-t border-border/10 flex items-center justify-between">
                                        <Skeleton className="h-4 w-24 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </div>
                            </div>
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
