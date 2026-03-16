/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/ui/glass-card";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return;
        }

        setLoading(true);

        try {
            const data: any = await api.post("/auth/reset-password", {
                token,
                password,
            });
            toast.success(data.message || "Password reset successfully!");
            router.push("/auth/login");
        } catch (error: any) {
            console.error("Error:", error);
            toast.error(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col relative overflow-hidden selection:bg-primary/30 selection:text-primary">
            {/* Background Mesh Gradient */}
            <div className="absolute inset-0 mesh-gradient dark:mesh-gradient-dark -z-10" />

            {/* Floating Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-max-7xl h-full -z-5 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <GlassCard className="w-full max-w-md p-6 md:p-8 border-primary/10 shadow-premium animate-in fade-in zoom-in duration-500">
                    <div className="flex flex-col items-center text-center space-y-4 mb-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-soft group hover:rotate-12 transition-all duration-300">
                            <span className="text-4xl">🛡️</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight text-foreground">Reset Password</h1>
                            <p className="text-muted-foreground font-semibold">Enter your <span className="text-primary">new password</span> below</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <Label htmlFor="password" title="New Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</Label>
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

                        <div className="space-y-3">
                            <Label htmlFor="confirmPassword" title="Confirm Password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className="h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    <span>Updating...</span>
                                </div>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border/40 text-center">
                        <p className="text-sm font-semibold text-muted-foreground">
                            Changed your mind?{" "}
                            <Link href="/auth/login" className="text-primary hover:text-primary/80 transition-colors font-black">
                                Back to login
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default ResetPassword;
