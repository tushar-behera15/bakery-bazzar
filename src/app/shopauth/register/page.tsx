"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Store,
    User,
    MapPin,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from "@/components/ui/glass-card";
import Link from "next/link";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function SellerSignup() {
    const router = useRouter();

    // Shop
    const [shopName, setShopName] = useState("");
    const [loading, setLoading] = useState(false);
    const [shopDescription, setShopDescription] = useState("");
    const [shopEmail, setShopEmail] = useState("");
    const [shopContact, setShopContact] = useState("");
    const [shopAddress, setShopAddress] = useState("");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const geo = useGeolocation();

    const handleAutoLocation = () => {
        if (geo.latitude && geo.longitude) {
            setLatitude(geo.latitude);
            setLongitude(geo.longitude);
            toast.success("Location detected!");
        } else if (geo.error) {
            toast.error(geo.error);
        } else {
            toast.info("Detecting location... please wait.");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/shop/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: shopName,
                    description: shopDescription,
                    contactEmail: shopEmail,
                    contactNumber: shopContact,
                    address: shopAddress,
                    latitude: latitude,
                    longitude: longitude
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Seller account created successfully!");
                router.push("/");
            } else {
                toast.error(data.message || "Registration failed!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!",);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row relative selection:bg-primary/30 selection:text-primary">
            {/* Left Panel — Illustration & Branding */}
            <div className="hidden md:flex w-2/5 sticky top-0 h-screen flex-col justify-center items-center overflow-hidden mesh-gradient dark:mesh-gradient-dark p-12 text-foreground">
                <div className="absolute inset-0 bg-primary/5 -z-10" />
                {/* Floating orbs for extra depth */}
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                
                <div className="text-center space-y-8 relative z-10">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-linear-to-br from-primary to-primary/60 flex items-center justify-center mx-auto shadow-premium animate-bounce duration-[3000ms]">
                        <Store className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none">
                            Grow Your <br />
                            <span className="text-primary italic font-serif">Bakery</span>
                        </h1>
                        <p className="text-muted-foreground font-semibold text-lg max-w-sm mx-auto leading-relaxed">
                            Join the premier marketplace for artisan bakers and share your passion with thousands of customers.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-10">
                        {[
                            { label: "Partner Bakeries", value: "200+" },
                            { label: "Active Orders", value: "15k+" },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-background/50 border border-primary/10 backdrop-blur-md">
                                <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-8 left-12 right-12 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    <span>© 2026 BakeryBazzar</span>
                    <span>Empowering Artisan Bakers</span>
                </div>
            </div>

            {/* Right Panel — Scrollable Form */}
            <div className="flex-1 overflow-y-auto flex justify-center items-center p-6 md:p-16 lg:p-24">
                <div className="w-full max-w-2xl space-y-12 py-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
                            <User className="w-10 h-10 text-primary" />
                            Seller Registration
                        </h2>
                        <p className="text-muted-foreground font-semibold text-lg">
                            Ready to take your bakery online? Fill in your details below.
                        </p>
                    </div>

                    <GlassCard className="p-8 md:p-12 border-primary/5 shadow-premium">
                        <form onSubmit={handleSignup} className="space-y-10">
                            {/* 🏪 Shop Info */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                                    <Store className="w-5 h-5 text-primary" />
                                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Shop Information</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="shopName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Shop Name</Label>
                                        <Input
                                            id="shopName"
                                            placeholder="The Classic Crust"
                                            className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                            value={shopName}
                                            onChange={(e) => setShopName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="shopEmail" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Shop Email</Label>
                                        <Input
                                            id="shopEmail"
                                            type="email"
                                            placeholder="hello@shop.com"
                                            className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                            value={shopEmail}
                                            onChange={(e) => setShopEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="shopContact" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Shop Phone</Label>
                                        <Input
                                            id="shopContact"
                                            placeholder="+91 98765 43210"
                                            className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                            value={shopContact}
                                            onChange={(e) => setShopContact(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <div className="flex items-center justify-between ml-1">
                                            <Label htmlFor="shopAddress" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Address</Label>
                                            <Button 
                                                type="button" 
                                                variant="link" 
                                                size="sm" 
                                                className="h-auto p-0 text-[10px] font-black uppercase tracking-[0.1em] text-primary hover:text-primary/80"
                                                onClick={handleAutoLocation}
                                            >
                                                Auto-detect Location
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 text-primary/40 w-5 h-5" />
                                            <Textarea
                                                id="shopAddress"
                                                rows={2}
                                                className="pl-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium min-h-[100px] py-4 text-foreground bg-transparent"
                                                placeholder="Complete bakery address..."
                                                value={shopAddress}
                                                onChange={(e) => setShopAddress(e.target.value)}
                                                required
                                            />
                                        </div>
                                        {(latitude || longitude) && (
                                            <p className="text-[10px] font-semibold text-primary/60 ml-1 italic animate-in slide-in-from-top-1">
                                                Coordinates captured: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <Label htmlFor="shopDescription" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Description</Label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-4 text-primary/40 w-5 h-5" />
                                            <Textarea
                                                id="shopDescription"
                                                rows={3}
                                                className="pl-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium min-h-[120px] py-4 text-foreground bg-transparent"
                                                placeholder="What makes your bakery special?"
                                                value={shopDescription}
                                                onChange={(e) => setShopDescription(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-primary text-primary-foreground font-black text-lg rounded-2xl shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all group"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                        <span>Submitting Application...</span>
                                    </div>
                                ) : (
                                    "Launch Your Shop"
                                )}
                            </Button>
                        </form>
                    </GlassCard>

                    <p className="text-center text-sm font-semibold text-muted-foreground">
                        Already have a seller account?{" "}
                        <Link href="/auth/login" className="text-primary hover:text-primary/80 transition-colors font-black">
                            Sign in to dashboard
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
