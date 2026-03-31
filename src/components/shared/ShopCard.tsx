"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface ShopCardProps {
    id: number;
    name: string;
    logo: string | StaticImageData;
    tagline: string;
    rating: number;
    address?: string;
    distance?: number | null;
}

export default function ShopCard({ id, name, logo, tagline, rating, address, distance }: ShopCardProps) {
    return (
        <Link href={`/shops/${id}`}>
            <GlassCard 
                className="h-full group/card p-0 overflow-hidden border-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2" 
                hover
            >
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={logo}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity duration-300" />
                    
                    <div className="absolute top-4 left-4 bg-background/80 blur-backdrop-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-premium text-foreground">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-xs font-black">{rating}</span>
                    </div>

                    {distance !== undefined && distance !== null && (
                        <div className={cn(
                            "absolute top-4 right-4 blur-backdrop-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-premium text-primary-foreground animate-in fade-in zoom-in duration-500 font-black text-xs",
                            distance < 0.2 ? "bg-green-500/90 animate-pulse border border-green-400" : 
                            distance < 0.5 ? "bg-amber-500/90" : 
                            "bg-primary/90"
                        )}>
                            <MapPin className="h-3.5 w-3.5 fill-current" />
                            <span>
                                {distance < 0.2 ? "You're here!" : 
                                 distance < 0.5 ? "Nearby" : 
                                 `${distance.toFixed(1)} km away`}
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl font-black group-hover/card:text-primary transition-colors line-clamp-1 text-foreground tracking-tight">{name}</h3>
                        <p className="text-muted-foreground font-medium text-xs sm:text-sm line-clamp-2">{tagline}</p>
                    </div>

                    {address && (
                        <div className="flex items-center gap-2 text-muted-foreground/60 text-xs font-semibold">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="line-clamp-1">{address}</span>
                        </div>
                    )}

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-primary">View Products</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-all duration-300">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </GlassCard>
        </Link>
    );
}
