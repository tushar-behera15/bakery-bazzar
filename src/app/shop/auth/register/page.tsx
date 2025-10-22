"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
    Store,
    User,
    Mail,
    Phone,
    Lock,
    MapPin,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function SellerSignup() {
    const router = useRouter();

    // User
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    // Shop
    const [shopName, setShopName] = useState("");
    const [shopDescription, setShopDescription] = useState("");
    const [shopEmail, setShopEmail] = useState("");
    const [shopContact, setShopContact] = useState("");
    const [shopAddress, setShopAddress] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/register-seller", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phone,
                    shop: {
                        name: shopName,
                        description: shopDescription,
                        contactEmail: shopEmail,
                        contactNumber: shopContact,
                        address: shopAddress,
                    },
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Seller account created successfully!");
                router.push("/auth/login");
            } else {
                toast.error(data.message || "Registration failed!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!",);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-rose-50 via-orange-50 to-yellow-50 flex flex-col md:flex-row">
            {/* Left Panel — Illustration */}
            <div className="hidden md:flex w-1/2 sticky top-0 h-screen flex-col justify-center items-center bg-linear-to-br from-orange-500 to-rose-400 text-white p-12 shadow-2xl">
                <div className="text-center space-y-4">
                    <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                        <Store className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold leading-tight">Welcome Seller!</h1>
                    <p className="text-white/90 text-lg">
                        Open your bakery shop on BakeryBazzar and share your sweet creations with the world 🍰
                    </p>
                </div>
                <div className="absolute bottom-6 text-sm text-white/70">
                    Trusted by 100+ bakeries worldwide
                </div>
            </div>

            {/* Right Panel — Scrollable Form */}
            <div className="flex-1 overflow-y-auto flex justify-center items-center p-6 md:p-12">
                <Card className="w-full max-w-2xl shadow-lg border-none bg-white/80 backdrop-blur-lg">
                    <CardHeader className="text-center mb-4">
                        <CardTitle className="text-3xl font-bold text-gray-800 flex justify-center items-center gap-2">
                            <User className="w-6 h-6 text-primary" />
                            Seller Registration
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            Let’s set up your shop in just a few steps!
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-8">
                            {/* 👤 Account Info */}
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" /> Account Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name" className="mb-2">Full Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="mb-2">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="email"
                                                type="email"
                                                className="pl-8"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="mb-2">Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="phone"
                                                className="pl-8"
                                                placeholder="9876543210"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="password" className="mb-2">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="password"
                                                type="password"
                                                className="pl-8"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="confirm" className="mb-2">Confirm Password</Label>
                                        <Input
                                            id="confirm"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 🏪 Shop Info */}
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center gap-2">
                                    <Store className="w-5 h-5 text-primary" /> Shop Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="shopName" className="mb-2">Shop Name</Label>
                                        <Input
                                            id="shopName"
                                            placeholder="Sweet Crumbs Bakery"
                                            value={shopName}
                                            onChange={(e) => setShopName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="shopEmail" className="mb-2">Shop Email</Label>
                                        <Input
                                            id="shopEmail"
                                            type="email"
                                            placeholder="shop@example.com"
                                            value={shopEmail}
                                            onChange={(e) => setShopEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="shopContact" className="mb-2">Shop Phone</Label>
                                        <Input
                                            id="shopContact"
                                            placeholder="9876543210"
                                            value={shopContact}
                                            onChange={(e) => setShopContact(e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="shopAddress" className="mb-2">Address</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                                            <Textarea
                                                id="shopAddress"
                                                rows={2}
                                                className="pl-8"
                                                placeholder="123 Main Street, Mumbai, India"
                                                value={shopAddress}
                                                onChange={(e) => setShopAddress(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="shopDescription" className="mb-2">Description</Label>
                                        <div className="relative">
                                            <FileText className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                                            <Textarea
                                                id="shopDescription"
                                                rows={3}
                                                className="pl-8"
                                                placeholder="Describe your bakery and specialties..."
                                                value={shopDescription}
                                                onChange={(e) => setShopDescription(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-linear-to-r from-orange-500 to-rose-500 text-white font-semibold text-lg shadow-lg hover:scale-[1.02] transition-transform"
                            >
                                Register as Seller
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="text-center mt-4  flex gap-1 justify-center items-center">
                        <div className="text-sm text-gray-500">
                            <p>Already a seller?{" "}</p>
                            <Link
                                href="/auth/login"
                                className="text-primary hover:underline font-medium"
                            >
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
