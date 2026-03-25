"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Mail, Phone, CheckCircle2, Store, MapPin } from "lucide-react"
import GlassCard from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";

interface Owner {
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
}

interface Shop {
    name: string;
    address: string;
    description?: string;
    contactEmail: string;
    contactNumber: string;
    latitude?: number | null;
    longitude?: number | null;
    owner: Owner;
}

export default function OwnerProfilePage() {
    const queryClient = useQueryClient()
    const geo = useGeolocation();

    const { data: shop, isLoading: loading } = useQuery<Shop>({
        queryKey: ["shop-me"],
        queryFn: async () => {
            const res = await api.get<{ shop: Shop }>("/shop/me", { credentials: "include" })
            return res.shop
        },
        staleTime: 1000 * 60 * 5,
    })

    const updateLocationMutation = useMutation({
        mutationFn: async (coords: { latitude: number; longitude: number }) => {
            return await api.put("/shop/update", coords, { credentials: "include" })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shop-me"] })
            toast.success("Shop location updated successfully!")
        },
        onError: (err) => {
            console.error(err)
            toast.error("Failed to update location")
        }
    })

    const handleUpdateLocation = () => {
        if (!geo.latitude || !geo.longitude) {
            toast.error(geo.error || "Location not detected yet. Please wait or allow permissions.");
            return;
        }
        updateLocationMutation.mutate({ latitude: geo.latitude, longitude: geo.longitude })
    };

    if (loading) return <div className="text-center p-20 text-muted-foreground italic">Updating your profile view...</div>;
    if (!shop) return <div className="text-center p-20 text-destructive font-bold underline decoration-wavy">No shop found. Head to dashboard to setup.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

            {/* Owner Info - Premium Hero Style */}
            <GlassCard className="relative overflow-hidden border-none shadow-2xl p-0">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -ml-24 -mb-24 blur-3xl pointer-events-none" />
                
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Avatar with status indicator */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500 opacity-50" />
                        <Avatar className="h-32 w-32 border-4 border-background shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                            {shop.owner.avatarUrl ? (
                                <AvatarImage src={shop.owner.avatarUrl} alt={shop.owner.name} className="object-cover" />
                            ) : (
                                <AvatarFallback className="text-3xl bg-linear-to-br from-primary/10 to-primary/5 text-primary font-bold">
                                    {shop.owner.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full shadow-lg z-20 border border-border">
                            <div className="bg-green-500 h-4 w-4 rounded-full border-2 border-background animate-pulse" />
                        </div>
                    </div>

                    {/* Owner info details */}
                    <div className="flex-1 space-y-6 text-center md:text-left pt-2">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    {shop.owner.name}
                                </h2>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors gap-1.5 py-1 px-3 rounded-full font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Seller
                                </Badge>
                            </div>
                            <p className="text-muted-foreground font-medium text-lg leading-none opacity-80">
                                Shop Owner & Administrator
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap items-center md:items-start gap-4 sm:gap-10">
                            <div className="flex items-center gap-3 group/item">
                                <div className="p-2.5 rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover/item:bg-primary/10 group-hover/item:scale-110 transition-all duration-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 leading-none mb-1">Email Address</p>
                                    <p className="font-semibold text-foreground/90">{shop.owner.email}</p>
                                </div>
                            </div>
                            
                            {shop.owner.phone && (
                                <div className="flex items-center gap-3 group/item">
                                    <div className="p-2.5 rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover/item:bg-primary/10 group-hover/item:scale-110 transition-all duration-300">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 leading-none mb-1">Phone Number</p>
                                        <p className="font-semibold text-foreground/90">{shop.owner.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 md:pt-2">
                        <Button 
                            className="rounded-full px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 gap-2 font-semibold text-base"
                        >
                            <Pencil className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shop Information */}
                <GlassCard className="border-none shadow-xl">
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Shop Details</h3>
                                <p className="text-xs text-muted-foreground">Basic information about your bakery</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">Shop Name</Label>
                                <p className="text-lg font-semibold px-1">{shop.name}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">Description</Label>
                                <p className="text-sm text-foreground/80 leading-relaxed px-1 italic">&quot;{shop.description || "No description provided."}&quot;</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Shop Address */}
                <GlassCard className="border-none shadow-xl">
                    <div className="p-6 space-y-6 h-full flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Shop Location</h3>
                                    <p className="text-xs text-muted-foreground">Where your magic happens</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">Full Address</Label>
                                <p className="text-sm font-medium leading-relaxed px-1">{shop.address}</p>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">Coordinates</Label>
                                <p className="text-[10px] font-mono font-medium px-1">
                                    {shop.latitude && shop.longitude 
                                        ? `${shop.latitude.toFixed(6)}, ${shop.longitude.toFixed(6)}`
                                        : "Not set"}
                                </p>
                            </div>
                        </div>

                        <Button 
                            variant="outline" 
                            className="w-full rounded-xl border-primary/20 hover:bg-primary/5 font-bold gap-2"
                            onClick={handleUpdateLocation}
                            disabled={updateLocationMutation.isPending}
                        >
                            {updateLocationMutation.isPending ? (
                                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                            ) : (
                                <MapPin className="w-4 h-4" />
                            )}
                            {shop.latitude ? "Update to Current Location" : "Set to Current Location"}
                        </Button>
                    </div>
                </GlassCard>
            </div>

            {/* Business Consistency / Performance (New) */}
            <GlassCard className="border-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold tracking-tight">Business Consistency</h3>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 rounded-full font-bold">Excellent</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "Completion Rate", value: "98%", color: "text-green-500" },
                            { label: "Avg. Preparation", value: "24m", color: "text-blue-500" },
                            { label: "Customer Rating", value: "4.9/5", color: "text-yellow-500" },
                            { label: "On-time Delivery", value: "95%", color: "text-purple-500" }
                        ].map((metric, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">{metric.label}</p>
                                <p className={cn("text-2xl font-black", metric.color)}>{metric.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}
