"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, Settings, ShieldCheck, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import GlassCard from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface User {
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
}

export default function OwnerProfilePage() {
    const { data: profile, isLoading: loading } = useQuery<User>({
        queryKey: ["admin-profile"],
        queryFn: async () => {
            const res = await api.get<{ user: User }>("/auth/me", { credentials: "include" })
            return res.user
        },
        staleTime: 1000 * 60 * 5,
    })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse italic">Accessing secure admin profile...</p>
            </div>
        )
    }
    
    if (!profile) return <div className="text-center p-20 text-destructive font-black underline decoration-wavy">Security Error: Profile not found.</div>

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

            {/* Admin Info - Premium Hero Style */}
            <GlassCard className="relative overflow-hidden border-none shadow-2xl p-0">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -ml-24 -mb-24 blur-3xl pointer-events-none" />
                
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Avatar with status indicator */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500 opacity-50" />
                        <Avatar className="h-32 w-32 border-4 border-background shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                            {profile.avatarUrl ? (
                                <AvatarImage src={profile.avatarUrl} alt={profile.name} className="object-cover" />
                            ) : (
                                <AvatarFallback className="text-3xl bg-linear-to-br from-primary/10 to-primary/5 text-primary font-bold">
                                    {profile.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full shadow-lg z-20 border border-border">
                            <ShieldCheck className="h-6 w-6 text-red-500 fill-red-500/10" />
                        </div>
                    </div>

                    {/* Admin info details */}
                    <div className="flex-1 space-y-6 text-center md:text-left pt-2">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    {profile.name}
                                </h2>
                                <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 transition-colors gap-1.5 py-1 px-3 rounded-full font-bold uppercase tracking-tighter text-[10px]">
                                    System Administrator
                                </Badge>
                            </div>
                            <p className="text-muted-foreground font-medium text-lg leading-none opacity-80">
                                Full System Oversight & Management
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap items-center md:items-start gap-4 sm:gap-10">
                            <div className="flex items-center gap-3 group/item">
                                <div className="p-2.5 rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover/item:bg-primary/10 group-hover/item:scale-110 transition-all duration-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 leading-none mb-1">Secure Email</p>
                                    <p className="font-semibold text-foreground/90">{profile.email}</p>
                                </div>
                            </div>
                            
                            {profile.phone && (
                                <div className="flex items-center gap-3 group/item">
                                    <div className="p-2.5 rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover/item:bg-primary/10 group-hover/item:scale-110 transition-all duration-300">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 leading-none mb-1">Contact Number</p>
                                        <p className="font-semibold text-foreground/90">{profile.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-4 md:pt-2">
                        <Button 
                            className="rounded-full px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 gap-2 font-semibold text-base"
                        >
                            <Settings className="w-4 h-4" /> System Config
                        </Button>
                    </div>
                </div>
            </GlassCard>

            {/* Platform Security Overview (New) */}
            <GlassCard className="border-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold tracking-tight">System Integrity</h3>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 rounded-full font-bold">Secure</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "Uptime Status", value: "99.9%", color: "text-green-500" },
                            { label: "Active Admins", value: "4", color: "text-blue-500" },
                            { label: "Last Backup", value: "3h ago", color: "text-yellow-500" },
                            { label: "Threat Level", value: "Low", color: "text-green-500" }
                        ].map((metric, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">{metric.label}</p>
                                <p className={cn("text-2xl font-black", metric.color)}>{metric.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}
