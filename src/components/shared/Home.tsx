'use client'

import { ArrowRight, Clock, Shield, Sparkles, ShoppingCart, Star, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import middleImage from "@/assets/hero-section.jpg";
import croissantImage from "@/assets/croissant.jpg";
import breadImage from "@/assets/bread.jpg";
import cakeImage from "@/assets/cake.jpg";
import macaronsImage from "@/assets/macarons.jpg";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/shared/Footer";
import SectionTitle from "@/components/shared/SectionTitle";
import GlassCard from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const HomePage = () => {
    const shops = [
        {
            id: 1,
            name: "XQZ Bakery",
            logo: croissantImage,
            tagline: "Artisan breads & specialty pastries",
            rating: 4.8,
            products: [
                { id: 1, name: "Sourdough Bread", price: 80, image: breadImage, category: "bread" },
                { id: 2, name: "Butter Croissant", price: 100, image: croissantImage, category: "pastry" },
                { id: 3, name: "Chocolate Pastry", price: 120, image: macaronsImage, category: "pastry" },
                { id: 4, name: "Almond Croissant", price: 130, image: croissantImage, category: "pastry" },
                { id: 5, name: "Pain au Chocolat", price: 150, image: breadImage, category: "pastry" },
            ],
        },
        {
            id: 2,
            name: "Sweet Crumbs",
            logo: cakeImage,
            tagline: "Bespoke cakes and gourmet desserts",
            rating: 4.9,
            products: [
                { id: 6, name: "Strawberry Cake", price: 350, image: cakeImage, category: "cake" },
                { id: 7, name: "Blueberry Muffin", price: 90, image: macaronsImage, category: "pastry" },
                { id: 8, name: "Vanilla Cupcake", price: 70, image: croissantImage, category: "cake" },
                { id: 9, name: "Chocolate Brownie", price: 110, image: cakeImage, category: "pastry" },
                { id: 10, name: "Lemon Tart", price: 150, image: macaronsImage, category: "pastry" },
            ],
        },
    ];

    const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) setUser(data.user);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden mesh-gradient dark:mesh-gradient-dark">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                    <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[0%] right-[-5%] w-[40%] h-[40%] bg-accent/15 rounded-full blur-[100px] animate-pulse delay-700" />
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <Zap className="h-3.5 w-3.5 fill-current" />
                            <span>Premium Bakery Marketplace</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                                Freshly <br />
                                <span className="text-primary italic font-serif relative">
                                    Baked
                                    <span className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-2 md:h-4 bg-primary/10 -skew-x-12 -z-10 opacity-50" />
                                </span>
                                <span className="text-foreground"> Joy</span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground font-semibold max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 text-balance">
                                Discover artisan breads, gourmet pastries, and bespoke cakes from the finest local bakeries, delivered directly to your door.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
                            <Link href="/products" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="h-16 px-10 text-lg font-black rounded-2xl gap-3 shadow-premium hover:shadow-2xl hover:-translate-y-1.5 transition-all w-full bg-primary text-primary-foreground group"
                                >
                                    Explore Menu
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/about" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-16 px-10 text-lg font-black rounded-2xl border-2 hover:bg-muted/50 transition-all w-full"
                                >
                                    Our Story
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-20 relative z-20 -mt-10">
                <div className="container mx-auto px-4">
                    <GlassCard className="p-10 md:p-14 border-primary/10 shadow-premium">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                            {[
                                { label: "Artisan Bakers", value: "50+", icon: Clock },
                                { label: "Daily Deliveries", value: "1.2k", icon: Zap },
                                { label: "Happy Customes", value: "10k+", icon: Star },
                                { label: "Product Varieties", value: "400+", icon: Sparkles },
                            ].map((stat, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center space-y-2">
                                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-2">
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <p className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">{stat.value}</p>
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </section>

            {/* Features section with a modern cards layout */}
            <section className="py-24 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Clock,
                                title: "Fresh Every Morning",
                                desc: "Our bakers start before the sun rises to ensure you get the freshest treats possible.",
                                color: "bg-blue-500/10 text-blue-600"
                            },
                            {
                                icon: Shield,
                                title: "Artisan Quality",
                                desc: "No preservatives, no shortcuts. Just pure, high-quality ingredients made with passion.",
                                color: "bg-primary/10 text-primary"
                            },
                            {
                                icon: Sparkles,
                                title: "Handcrafted Love",
                                desc: "Each item is crafted by hand, giving it a unique touch that machine-made goods lack.",
                                color: "bg-accent/20 text-accent-foreground"
                            }
                        ].map((feature, idx) => (
                            <GlassCard key={idx} className="p-10 group hover:bg-card border-none shadow-none hover:shadow-premium transition-all">
                                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-transform group-hover:rotate-12", feature.color)}>
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-muted-foreground font-semibold leading-relaxed">
                                    {feature.desc}
                                </p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shops Section */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <SectionTitle
                        title="Featured Bakeries"
                        subtitle="We've partnered with the best local artisans to bring you high-quality baked goods."
                    />

                    {shops.map((shop) => (
                        <div key={shop.id} className="mb-24 last:mb-0">
                            {/* Shop Header */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border shadow-soft shrink-0">
                                        <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                                            <Star className="h-3.5 w-3.5 fill-current" />
                                            <span>{shop.rating} Rated</span>
                                        </div>
                                        <h3 className="text-3xl font-black">{shop.name}</h3>
                                        <p className="text-muted-foreground font-medium">{shop.tagline}</p>
                                    </div>
                                </div>
                                <Link href="/products">
                                    <Button variant="ghost" className="font-bold group hover:text-primary">
                                        View full menu
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Carousel / Scroll Area */}
                            <div className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                                {shop.products.map((product) => (
                                    <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                                        <GlassCard className="flex flex-col h-full group">
                                            <div className="relative aspect-square overflow-hidden bg-muted/30">
                                                <Image
                                                    src={product.image.src}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <span className="absolute top-4 left-4 bg-background px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-lg font-bold line-clamp-1">{product.name}</h4>
                                                    <span className="text-xl font-black text-primary">₹{product.price}</span>
                                                </div>
                                                <Button size="sm" className="w-full rounded-xl font-bold gap-2">
                                                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                                                </Button>
                                            </div>
                                        </GlassCard>
                                    </div>
                                ))}
                                <div className="min-w-[200px] flex flex-col items-center justify-center snap-center">
                                    <Link href="/products">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all group">
                                            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                    <p className="mt-4 font-bold text-muted-foreground">See More</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="py-24 md:py-32 px-4">
                    <div className="container mx-auto">
                        <div className="relative rounded-[3rem] overflow-hidden bg-foreground text-background shadow-2xl group/cta">
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={middleImage}
                                    alt="Bakery background"
                                    fill
                                    className="object-cover opacity-20 grayscale brightness-50 transition-transform duration-1000 group-hover/cta:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-br from-primary/60 via-foreground/80 to-foreground" />
                            </div>

                            <div className="relative z-10 px-8 py-20 md:py-32 text-center max-w-3xl mx-auto space-y-12">
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    Start Your Morning With Bakery Bazzar
                                </h2>
                                <p className="text-xl font-semibold opacity-70 leading-relaxed text-balance animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                                    Join thousands of food lovers who get fresh, artisan baked goods delivered straight to their doorstep every single day.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                                    <Link href="/signup" className="w-full sm:w-auto">
                                        <Button
                                            size="lg"
                                            className="h-16 px-12 text-lg font-black bg-background text-foreground hover:bg-background/90 rounded-2xl w-full shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
                                        >
                                            Create Account
                                        </Button>
                                    </Link>
                                    <Link href="/login" className="w-full sm:w-auto">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="h-16 px-12 text-lg font-black border-background/20 bg-background/5 hover:bg-background/10 text-background rounded-2xl w-full backdrop-blur-md transition-all hover:-translate-y-1"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
};

export default HomePage;
