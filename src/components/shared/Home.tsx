'use client'

import { ArrowRight, Clock, Shield, Sparkles, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bakery.jpg";
import middleImage from "@/assets/hero-section.jpg";
import croissantImage from "@/assets/croissant.jpg";
import breadImage from "@/assets/bread.jpg";
import cakeImage from "@/assets/cake.jpg";
import macaronsImage from "@/assets/macarons.jpg";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/shared/Footer";

const HomePage = () => {
    const shops = [
        {
            id: 1,
            name: "XQZ Bakery",
            logo: croissantImage,
            tagline: "Fresh breads & pastries every day",
            products: [
                { id: 1, name: "Sourdough Bread", price: 80, image: breadImage, category: "bread" },
                { id: 2, name: "Butter Croissant", price: 100, image: croissantImage, category: "bread" },
                { id: 3, name: "Chocolate Pastry", price: 120, image: macaronsImage, category: "pastry" },
                { id: 4, name: "Almond Croissant", price: 130, image: croissantImage, category: "bread" },
                { id: 5, name: "Pain au Chocolat", price: 150, image: breadImage, category: "cake" },
            ],
        },
        {
            id: 2,
            name: "Sweet Crumbs",
            logo: cakeImage,
            tagline: "Cakes, muffins, and desserts",
            products: [
                { id: 6, name: "Strawberry Cake", price: 350, image: cakeImage, category: "cake" },
                { id: 7, name: "Blueberry Muffin", price: 90, image: macaronsImage, category: "pastry" },
                { id: 8, name: "Vanilla Cupcake", price: 70, image: croissantImage, category: "cake" },
                { id: 9, name: "Chocolate Brownie", price: 110, image: cakeImage, category: "pastry" },
                { id: 10, name: "Lemon Tart", price: 150, image: macaronsImage, category: "bread" },
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
        <div className="min-h-full flex flex-col">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-28">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <div className="space-y-6 lg:space-y-8">
                            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold inline-block">
                                ✨ Fresh Daily Since 2025
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                                <span className="bg-linear-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                                    Warm, Fresh, Irresistible
                                </span>
                                <br />
                                Straight to Your Door

                            </h1>
                            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-lg">
                                Discover handcrafted baked goods made with love and delivered fresh every day. Sweet, savory, and always delightful.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <Link href="/products">
                                    <Button
                                        size="lg"
                                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-hover transition-all"
                                    >
                                        Browse Products
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/about">
                                    <Button size="lg" variant="outline" className="gap-2 text-primary border-primary hover:bg-primary/10">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative w-full lg:w-auto">
                            <div className="aspect-video rounded-3xl overflow-hidden shadow-xl relative">
                                <Image
                                    src={heroImage}
                                    alt="Freshly baked treats"
                                    fill
                                    priority
                                    quality={100}
                                    className="object-cover rounded-3xl"
                                />
                            </div>
                            <div className="absolute -bottom-8 -left-8 w-32 sm:w-36 h-32 sm:h-36 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute -top-8 -right-8 w-32 sm:w-36 h-32 sm:h-36 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
                        </div>

                    </div>

                    {/* Features */}
                    <div className="flex justify-center items-center gap-12 py-12 flex-wrap mt-12">
                        {[{ icon: Clock, text: "Fresh Daily" }, { icon: Shield, text: "Quality Assured" }, { icon: Sparkles, text: "Handcrafted" }].map((feature, idx) => (
                            <div className="text-center hover:scale-105 transition-transform duration-300" key={idx}>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
                                    <feature.icon className="h-7 w-7 text-primary" />
                                </div>
                                <p className="text-base font-semibold text-foreground">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Shops Section with Carousel */}
            <section className="py-12 md:py-16 lg:py-20 bg-background overflow-x-hidden">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-12">Featured Bakeries</h2>

                    {shops.map((shop) => (
                        <div key={shop.id} className="mb-12 md:mb-16">
                            {/* Shop Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 sm:gap-0">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                                        <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-semibold">{shop.name}</h3>
                                        <p className="text-muted-foreground text-sm">{shop.tagline}</p>
                                    </div>
                                </div>
                                <Link href="/products">
                                    <Button variant="outline" className="text-sm flex items-center gap-1 border-primary text-primary hover:bg-primary/10">
                                        View All <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Carousel */}
                            <div className="flex gap-6 overflow-x-auto pb-3 hide-scrollbar">
                                {shop.products.map((product) => (
                                    <div key={product.id} className="min-w-[200px] sm:min-w-[240px] md:min-w-[260px] shrink-0 snap-start">
                                        <div className="flex flex-col h-full bg-background rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-shadow">
                                            {/* Image */}
                                            <div className="relative w-full aspect-4/3">
                                                <Image
                                                    src={product.image.src}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <span className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                                                    {product.category.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4 flex flex-col justify-between flex-1">
                                                <div className="mb-3">
                                                    <h4 className="font-semibold text-lg">{product.name}</h4>
                                                    <p className="text-lg sm:text-xl font-bold text-primary mt-1 text-left">₹{product.price}</p>
                                                </div>
                                                <Button size="sm" className="w-full flex gap-2 items-center mt-3 bg-primary text-primary-foreground hover:bg-primary/90">
                                                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src={middleImage}
                            alt="Delicious Bakery"
                            fill
                            className="object-cover w-full h-full brightness-60"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-primary/60 via-transparent to-secondary/60" />
                    </div>

                    <div className="relative container mx-auto px-4 text-center text-white z-10">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold drop-shadow-lg">
                                Ready to Treat Yourself?
                            </h2>
                            <p className="text-xl sm:text-2xl lg:text-3xl drop-shadow-md">
                                Join us today and get fresh, handcrafted baked goods delivered straight to your door!
                            </p>
                            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center mt-8">
                                <Link href="/signup">
                                    <Button
                                        size="lg"
                                        className="gap-3 bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl hover:bg-secondary/90 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                                    >
                                        Sign Up Now
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="text-white border-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-all duration-300 w-full sm:w-auto"
                                    >
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Floating Shapes */}
                        <div className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-yellow-300 rounded-full blur-3xl opacity-40 animate-pulse" />
                        <div className="absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-pink-300 rounded-full blur-3xl opacity-40 animate-pulse" />
                    </div>
                </section>
            )}

            {/* Footer */}
            <Footer />

        </div>
    );
};

export default HomePage;
