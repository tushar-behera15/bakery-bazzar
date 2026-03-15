'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/ui/glass-card";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Signup = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const router = useRouter();


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phone,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Registration successful! Redirecting to login...");
                router.push("/auth/login");
            } else {
                toast.error(data.message || "Registration failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col relative overflow-x-hidden selection:bg-primary/30 selection:text-primary">
            {/* Background Mesh Gradient */}
            <div className="absolute inset-0 mesh-gradient dark:mesh-gradient-dark -z-10" />

            {/* Floating Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-5 pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[0%] right-[-5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <GlassCard className="w-full max-w-3xl p-8 border-primary/10 shadow-premium animate-in fade-in zoom-in duration-500">
                    <div className="flex flex-col items-center text-center space-y-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-soft group hover:rotate-12 transition-all duration-300">
                            <span className="text-3xl">🥐</span>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-foreground">Create Account</h1>
                            <p className="text-muted-foreground font-semibold">Join the <span className="text-primary">BakeryBazzar</span> community</p>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Full Name */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@domain.com"
                                    className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="9876543210"
                                    className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" title="Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password" title="Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-primary text-primary-foreground font-black text-lg rounded-xl shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all group"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                    <span>Creating...</span>
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-border/40 text-center">
                        <p className="text-sm font-semibold text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-primary hover:text-primary/80 transition-colors font-black">
                                Login here
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Signup;
