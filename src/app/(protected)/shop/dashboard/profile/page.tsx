"use client"

import * as React from "react"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Owner {
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
}

interface Shop {
    name: string;
    address: string;
    description?: string;
    contactEmail: string;
    contactNumber: string;
    owner: Owner;
}

export default function OwnerProfilePage() {
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMyShop = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/shop/me", {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch shop");

                const data = await res.json();
                setShop(data.shop);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyShop();
    }, []);
    if (loading) return <div className="text-center">Loading...</div>;
    if (!shop) return <div>No shop found</div>;
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

            {/* Owner Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Owner Details</CardTitle>
                    <CardDescription>Basic information about the shop owner</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            {shop!.owner.avatarUrl ? (
                                <AvatarImage src={shop!.owner.avatarUrl} />
                            ) : (
                                <AvatarFallback>{shop!.owner.name.charAt(0)}</AvatarFallback>
                            )}
                        </Avatar>
                        <div>
                            <div className="text-lg font-medium">{shop!.owner.name}</div>
                            <div className="text-sm text-muted-foreground">{shop!.owner.email}</div>
                            <div className="text-sm text-muted-foreground">{shop!.owner.phone}</div>
                        </div>
                    </div>
                    <div className="flex items-end justify-end">
                        <Button variant="outline">Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Shop Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Shop Information</CardTitle>
                    <CardDescription>Details about your shop</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="shop-name" >Shop Name</Label>
                        <Input id="shop-name" defaultValue={shop!.name} readOnly className="mt-2" />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="shop-description">Description</Label>
                        <Input id="shop-description" defaultValue={shop!.description} readOnly className="mt-2" />
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Shop Address */}
            <Card>
                <CardHeader>
                    <CardTitle>Shop Address</CardTitle>
                    <CardDescription>Where your shop is located</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="shop-address">Address</Label>
                        <Input id="shop-address" defaultValue={shop!.address} readOnly className="mt-2" />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <Button variant="outline">Edit Address</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
