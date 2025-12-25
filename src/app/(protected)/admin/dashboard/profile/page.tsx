"use client"

import * as React from "react"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
}

export default function OwnerProfilePage() {
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMyShop = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch profile");

                const data = await res.json();
                setProfile(data.user);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyShop();
    }, []);
    if (loading) return <div className="text-center">Loading...</div>;
    if (!profile) return <div>No profile found</div>;
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

            {/* Owner Info */}
            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Basic information about the user</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            {profile.avatarUrl ? (
                                <AvatarImage src={profile.avatarUrl} />
                            ) : (
                                <AvatarFallback>{profile.name}</AvatarFallback>
                            )}
                        </Avatar>
                        <div>
                            <div className="text-lg font-medium">{profile.name}</div>
                            <div className="text-sm text-muted-foreground">{profile.email}</div>
                            <div className="text-sm text-muted-foreground">{profile.phone}</div>
                        </div>
                    </div>
                    <div className="flex items-end justify-end">
                        <Button variant="outline">Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>

            <Separator />


        </div>
    )
}
