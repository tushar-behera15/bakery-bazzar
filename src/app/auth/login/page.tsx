'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/ui/glass-card";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const router = useRouter();
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
                if (res.ok) {
                    router.push("/");
                } else {
                    setIsChecking(false);
                }
            } catch {
                setIsChecking(false);
            }

        };
        checkAuth();
    }, [router]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Login successful! Redirecting...");
                router.push("/")
            } else {
                toast.error(data.message || "Login failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    if (isChecking) {
        return (
            <div className="h-screen flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 mesh-gradient dark:mesh-gradient-dark -z-10" />
                <div className="h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full" />
            </div>
        );
    }

    return (

        <div className="h-screen flex flex-col relative overflow-hidden selection:bg-primary/30 selection:text-primary">
            {/* Background Mesh Gradient */}
            <div className="absolute inset-0 mesh-gradient dark:mesh-gradient-dark -z-10" />
            
            {/* Floating Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-5 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <GlassCard className="w-full max-w-md p-6 md:p-8 border-primary/10 shadow-premium animate-in fade-in zoom-in duration-500">
                    <div className="flex flex-col items-center text-center space-y-4 mb-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-soft group hover:rotate-12 transition-all duration-300">
                            <span className="text-4xl">🥐</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome Back</h1>
                            <p className="text-muted-foreground font-semibold">Login to your <span className="text-primary">BakeryBazzar</span> account</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@domain.com"
                                className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" title="Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Password</Label>
                                <Link href="/auth/forgot-password" title="Reset Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline">
                                    Forgot?
                                </Link>
                            </div>
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

                        <Button
                            type="submit"
                            className="w-full h-14 bg-primary text-primary-foreground font-black text-lg rounded-xl shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all group"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                "Login to Account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border/40 text-center">
                        <p className="text-sm font-semibold text-muted-foreground">
                            Don’t have an account?{" "}
                            <Link href="/auth/register" className="text-primary hover:text-primary/80 transition-colors font-black">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Login;
