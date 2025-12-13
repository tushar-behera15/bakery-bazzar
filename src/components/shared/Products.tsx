"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    imageUrl: string; // from backend
}

interface Shop {
    id: number;
    name: string;
    products: Product[];
}

export default function ProductsPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<number | null>(null);

    const handleAddToCart = async (productId: number) => {
        try {
            setAddingId(productId);

            const res = await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // ✅ send JWT cookie
                body: JSON.stringify({
                    productId,
                    quantity: 1,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to add to cart");
            }

            toast.success("Added to cart");
        } catch (error) {
            console.error("Add to cart failed:", error);
        } finally {
            setAddingId(null);
        }
    };

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/product");
                const data = await res.json();

                // Group products by shop
                const grouped: { [key: number]: Shop } = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data.forEach((product: any) => {
                    if (!grouped[product.shop.id]) {
                        grouped[product.shop.id] = {
                            id: product.shop.id,
                            name: product.shop.name,
                            products: [],
                        };
                    }
                    grouped[product.shop.id].products.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        category: product.category?.name || "Uncategorized",
                        imageUrl: product.images?.[0]?.url || "/placeholder.jpg",
                    });
                });

                setShops(Object.values(grouped));
            } catch (error) {
                console.error("Failed to fetch shops/products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    const filteredShops = shops
        .map((shop) => ({
            ...shop,
            products: shop.products.filter(
                (p) =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase())
            ),
        }))
        .filter((shop) => shop.name.toLowerCase().includes(query.toLowerCase()) || shop.products.length > 0);

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
                    </div>
                </div>

                {/* 🏪 Shop + Products */}
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={`shop-skeleton-${i}`} className="space-y-4">
                            <Skeleton className="h-6 w-1/3 bg-pink-200" />
                            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-4 px-4">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={`product-skeleton-${i}-${j}`} className="w-60 sm:w-64 md:w-72 shrink-0 snap-start">
                                        <Skeleton className="h-64 w-full rounded-2xl bg-pink-200" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : filteredShops.length > 0 ? (
                    filteredShops.map((shop) => (
                        <div key={`shop-${shop.id}`} className="space-y-4">
                            <h2 className="text-2xl font-semibold text-primary">{shop.name}</h2>
                            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-4 px-4">
                                {shop.products.map((product) => (
                                    <div key={`product-${shop.id}-${product.id}`} className="w-60 sm:w-64 md:w-72 shrink-0 snap-start">
                                        <div className="flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-shadow">
                                            {/* Image */}
                                            <div className="relative w-full aspect-4/3">
                                                <Image
                                                    src={product.imageUrl}
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
                                                    disabled={addingId === product.id}
                                                    onClick={() => handleAddToCart(product.id)}
                                                    className="w-full flex gap-2 items-center mt-3 bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    {addingId === product.id ? "Adding..." : "Add to Cart"}
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
