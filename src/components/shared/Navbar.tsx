'use client'
import { ShoppingCart, Menu, User, X, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ProgressBarLink } from "./ProgressLink";
import { ModeToggle } from "../dashboard-stuffs/mode-toggle";
import { BASE_URL } from "@/lib/api";


interface UserType {
    name?: string;
    email: string;
    role: string;
}

const Navbar = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/shops", label: "Shops" },
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
        { href: "/orders", label: "Orders" },
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BASE_URL}/auth/me`, {

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
            const res = await fetch(`${BASE_URL}/auth/logout`, {

                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                setUser(null);
                toast.success("Logged out successfully");
                setDrawerOpen(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setDrawerOpen(false);
    }, [pathname]);

    const fetchCartCount = async () => {
        try {
            const res = await fetch(`${BASE_URL}/cart`, {

                credentials: "include",
            });

            if (!res.ok) {
                setCartCount(0);
                return;
            }

            const cartItems = await res.json();
            setCartCount(cartItems.totalCount || 0);
        } catch (err) {
            console.error(err);
            setCartCount(0);
        }
    };

    useEffect(() => {
        fetchCartCount();
        const handler = () => fetchCartCount();
        window.addEventListener("cart-updated", handler);
        return () => window.removeEventListener("cart-updated", handler);
    }, []);

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-white/10 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <ProgressBarLink href="/" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-soft group-hover:shadow-premium transition-all duration-300 group-hover:rotate-12">
                                <span className="text-xl">🥐</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                                Bakery<span className="text-primary">Bazzar</span>
                            </span>
                        </ProgressBarLink>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1.5 px-1.5 py-1 rounded-full bg-muted/50 border border-border/40">
                            {links.map(({ href, label }) => (
                                <ProgressBarLink
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "px-4 py-1.5 text-sm font-medium transition-all rounded-full relative group/link",
                                        pathname === href
                                            ? "bg-background text-primary shadow-sm dark:text-white dark:bg-white/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-background/50 dark:text-zinc-400 dark:hover:text-white"
                                    )}
                                >
                                    {label}
                                    {pathname === href && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                    )}
                                </ProgressBarLink>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-3">
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-24 rounded-full" />
                                        <Skeleton className="h-9 w-9 rounded-full" />
                                    </div>
                                ) : user ? (
                                    <div className="flex items-center gap-3">
                                        <ProgressBarLink
                                            href={
                                                user.role === "SELLER"
                                                    ? "shop/dashboard"
                                                    : user.role === "ADMIN"
                                                        ? "admin/dashboard"
                                                        : "user/dashboard"
                                            }
                                            className="text-sm font-medium hover:text-primary transition-colors pr-2 border-r border-border dark:text-zinc-300 dark:hover:text-primary"
                                        >
                                            {user.name ? user.name.split(" ")[0] : "Profile"}
                                        </ProgressBarLink>

                                        {user.role !== "SELLER" && (
                                            <ProgressBarLink href="/shopauth/register">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="rounded-full text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all"
                                                >
                                                    Become a Seller
                                                </Button>
                                            </ProgressBarLink>
                                        )}

                                        <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-full px-4 h-9">
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    <ProgressBarLink href="/auth/login">
                                        <Button variant="outline" size="sm" className="rounded-full h-9 px-5 gap-2 group">
                                            <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                            <span>Login</span>
                                        </Button>
                                    </ProgressBarLink>
                                )}
                            </div>

                            <div className="flex items-center gap-1 ml-1 px-1 py-1 rounded-full bg-muted/30 border border-border/40">
                                <ProgressBarLink href="/cart">
                                    <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-background hover:shadow-sm">
                                        <ShoppingCart className="h-[18px] w-[18px]" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-4.5 w-4.5 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full border-2 border-background animate-in zoom-in">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Button>
                                </ProgressBarLink>
                                <ModeToggle />
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden rounded-full hover:bg-muted"
                                onClick={() => setDrawerOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div
                className={cn(
                    "fixed inset-0 z-100 transition-opacity duration-300 md:hidden",
                    drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
                <div
                    className={cn(
                        "absolute right-0 top-0 h-full w-[280px] bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-out flex flex-col",
                        drawerOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="flex items-center justify-between p-5 border-b border-border/50">
                        <span className="font-bold tracking-tight">Menu</span>
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setDrawerOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex flex-col p-4 gap-1.5 overflow-y-auto flex-1">
                        {links.map(({ href, label }) => (
                            <ProgressBarLink
                                key={href}
                                href={href}
                                className={cn(
                                    "px-4 py-3 rounded-xl flex items-center justify-between transition-colors",
                                    pathname === href
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "hover:bg-muted text-foreground/80 hover:text-foreground"
                                )}
                            >
                                {label}
                                <ChevronRight className={cn("h-4 w-4 opacity-0 transition-all", pathname === href && "opacity-100 translate-x-1")} />
                            </ProgressBarLink>
                        ))}
                    </div>

                    <div className="p-5 border-t border-border/50 space-y-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold truncate max-w-[140px]">{user.name || user.email}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</span>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    {user.role !== "SELLER" && (
                                        <ProgressBarLink href="/shopauth/register">
                                            <Button className="w-full rounded-xl bg-linear-to-br from-primary to-primary/80 hover:shadow-premium transition-all">
                                                Become a Seller
                                            </Button>
                                        </ProgressBarLink>
                                    )}
                                    <Button onClick={handleLogout} variant="outline" className="w-full rounded-xl">
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <ProgressBarLink href="/auth/login">
                                <Button className="w-full rounded-xl gap-2 h-11">
                                    <User className="h-4 w-4" />
                                    Login to your account
                                </Button>
                            </ProgressBarLink>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
;
