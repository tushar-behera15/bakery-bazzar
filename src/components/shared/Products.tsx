"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ import local images
import breadImage from "@/assets/bread.jpg";
import croissantImage from "@/assets/croissant.jpg";
import cakeImage from "@/assets/cake.jpg";
import macaronsImage from "@/assets/macarons.jpg";

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: typeof import("*.jpg").default;
}

interface Shop {
    id: number;
    name: string;
    products: Product[];
}

const allShops: Shop[] = [
    {
        id: 1,
        name: "XQZ Bakery",
        products: [
            { id: 1, name: "Sourdough Bread", price: 80, image: breadImage, category: "Bread" },
            { id: 2, name: "Butter Croissant", price: 100, image: croissantImage, category: "Bread" },
            { id: 3, name: "Chocolate Pastry", price: 120, image: cakeImage, category: "Pastry" },
            { id: 4, name: "Almond Croissant", price: 130, image: croissantImage, category: "Bread" },
            { id: 5, name: "Pain au Chocolat", price: 150, image: macaronsImage, category: "Cake" },
        ],
    },
    {
        id: 2,
        name: "SweetCrust Delights",
        products: [
            { id: 6, name: "Cupcake", category: "Dessert", price: 60, image: cakeImage },
            { id: 7, name: "Brownie", category: "Chocolate", price: 100, image: croissantImage },
            { id: 8, name: "Donut", category: "Snack", price: 70, image: macaronsImage },
        ],
    },
    {
        id: 3,
        name: "Bake & Bite Corner",
        products: [
            { id: 9, name: "Banana Muffin", category: "Muffin", price: 90, image: croissantImage },
            { id: 10, name: "Cheese Tart", category: "Tart", price: 120, image: breadImage },
            { id: 11, name: "Strawberry Pie", category: "Pie", price: 180, image: cakeImage },
        ],
    },
];

export default function ProductsPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timeout);
    }, []);

    const filteredShops = allShops
        .map((shop) => ({
            ...shop,
            products: shop.products.filter(
                (p) =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase())
            ),
        }))
        .filter(
            (shop) =>
                shop.name.toLowerCase().includes(query.toLowerCase()) ||
                shop.products.length > 0
        );

    return (
        <section className="py-16 bg-linear-to-b min-h-full">
            <div className="max-w-7xl mx-auto px-4 space-y-10">
                {/* 🔍 Sticky Search Bar */}
                <div className="sticky top-16 bg-pink-50/90 backdrop-blur-md z-20 py-4 px-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-pink-200">
                    <h1 className="text-2xl sm:text-3xl font-bold text-pink-700 text-center sm:text-left">
                        Explore Delicious Bakeries 🍰
                    </h1>
                    <div className="relative w-full sm:w-96">
                        <Input
                            placeholder="Search your favorite shop or product..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl border border-pink-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-2.5 h-5 w-5 text-pink-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35m2.85-4.15a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* 🏪 Shop + Products */}
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-6 w-1/3 bg-pink-200" />
                            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-4 px-4">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="w-60 sm:w-64 md:w-72 shrink-0 snap-start">
                                        <Skeleton className="h-64 w-full rounded-2xl bg-pink-200" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : filteredShops.length > 0 ? (
                    filteredShops.map((shop) => (
                        <div key={shop.id} className="space-y-4">
                            <h2 className="text-2xl font-semibold text-primary">{shop.name}</h2>
                            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-4 px-4">
                                {shop.products.map((product) => (
                                    <div key={product.id} className="w-60 sm:w-64 md:w-72 shrink-0 snap-start">
                                        <div className="flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-shadow">
                                            {/* Image */}
                                            <div className="relative w-full aspect-4/3">
                                                <Image
                                                    src={product.image.src}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                    {product.category.toUpperCase()}
                                                </span>
                                            </div>
                                            {/* Info */}
                                            <div className="p-4 flex flex-col justify-between flex-1">
                                                <div>
                                                    <h4 className="font-semibold text-lg">{product.name}</h4>
                                                    <p className="text-lg sm:text-xl font-bold text-primary mt-1">
                                                        ₹{product.price}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="w-full flex gap-2 items-center mt-3 bg-primary text-white hover:bg-primary/90 transition-colors"
                                                >
                                                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 text-lg mt-10">
                        No shops or products found for “{query}”
                    </div>
                )}
            </div>
        </section>
    );
}
