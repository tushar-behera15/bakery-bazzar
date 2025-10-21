'use client'
import { ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface UserType {
    name?: string;
    email: string;
}

const Navbar = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                setUser(null);
                toast.success("Logout successfully...");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center">
                            <span className="text-2xl">🥐</span>
                        </div>
                        <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                            BakeryBazzar
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-foreground hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/products" className="text-foreground hover:text-primary transition-colors">
                            Products
                        </Link>
                        <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                            Contact
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {loading ? (
                            // 🔹 Skeletons while loading
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-24 rounded-md" />
                                <Skeleton className="h-8 w-28 rounded-md" />
                                <Skeleton className="h-8 w-20 rounded-md" />
                            </div>
                        ) : user ? (
                            <>
                                {/* User name */}
                                <span className="hidden sm:inline font-medium">
                                    <a href="https://seller-dashboard-blue.vercel.app/dashboard/">
                                        Welcome, {user.name ? user.name.split(" ")[0] : user.email}
                                    </a>
                                </span>

                                {/* Become a Seller */}
                                <Link href="/become-seller">
                                    <Button
                                        size="sm"
                                        className="bg-linear-to-r from-yellow-400 to-orange-500 text-white font-semibold 
                  transition-transform duration-300 ease-in-out
                  hover:scale-105 hover:shadow-lg hover:from-orange-500 hover:to-yellow-400"
                                    >
                                        Become a Seller
                                    </Button>
                                </Link>

                                {/* Logout */}
                                <Button onClick={handleLogout} variant="outline" size="sm">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            // Not logged in
                            <Link href="/auth/login">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Login</span>
                                </Button>
                            </Link>
                        )}

                        {/* Cart */}
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                                    0
                                </Badge>
                            </Button>
                        </Link>

                        {/* Mobile Menu */}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
