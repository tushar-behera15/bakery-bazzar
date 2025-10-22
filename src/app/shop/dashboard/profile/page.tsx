"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function OwnerProfilePage() {
    // Dummy data
    const owner = {
        name: "Rohit Sharma",
        email: "rohit.sharma@example.com",
        phone: "+91 9876543210",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
    }

    const shop = {
        name: "Ganesh Bakery",
        category: "Bakery & Snacks",
        description: "We provide freshly baked goods, snacks, and beverages daily.",
        address: "123 Main Street",
        city: "Navsari",
        state: "Gujarat",
        zip: "400001",
    }

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
                            {owner.avatarUrl ? (
                                <AvatarImage src={owner.avatarUrl} alt={owner.name} />
                            ) : (
                                <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                            )}
                        </Avatar>
                        <div>
                            <div className="text-lg font-medium">{owner.name}</div>
                            <div className="text-sm text-muted-foreground">{owner.email}</div>
                            <div className="text-sm text-muted-foreground">{owner.phone}</div>
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
                        <Input id="shop-name" defaultValue={shop.name} readOnly className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="shop-category">Category</Label>
                        <Input id="shop-category" defaultValue={shop.category} readOnly className="mt-2" />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="shop-description">Description</Label>
                        <Input id="shop-description" defaultValue={shop.description} readOnly className="mt-2" />
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
                        <Input id="shop-address" defaultValue={shop.address} readOnly className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="shop-city">City</Label>
                        <Input id="shop-city" defaultValue={shop.city} readOnly className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="shop-state">State</Label>
                        <Input id="shop-state" defaultValue={shop.state} readOnly className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="shop-zip">ZIP Code</Label>
                        <Input id="shop-zip" defaultValue={shop.zip} readOnly className="mt-2" />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <Button variant="outline">Edit Address</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
