"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Pencil, Trash2, MapPin, Mail, Phone, CheckCircle2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api";
import { Address, CreateAddressInput, UpdateAddressInput } from "@/types/address";
import { toast } from "sonner";
import GlassCard from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
}

export default function UserProfilePage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
    const [formData, setFormData] = React.useState<Partial<CreateAddressInput>>({
        label: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        phone: "",
    });

    const { data: profile, isLoading: profileLoading } = useQuery<User>({
        queryKey: ["user-me"],
        queryFn: async () => {
            const res = await api.get<{ user: User }>("/auth/me", { credentials: "include" })
            return res.user
        },
        staleTime: 1000 * 60 * 5,
    })

    const { data: addresses = [], isLoading: addressesLoading } = useQuery<Address[]>({
        queryKey: ["user-addresses", profile?.id],
        queryFn: async () => {
            return await api.get<Address[]>(`/addresses/user/${profile?.id}`, { credentials: "include" })
        },
        enabled: !!profile?.id,
        staleTime: 1000 * 60 * 5,
    })

    const createAddressMutation = useMutation({
        mutationFn: async (data: Partial<CreateAddressInput>) => {
            return await api.post<Address>("/addresses", { ...data, userId: profile?.id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-addresses", profile?.id] })
            toast.success("Address added successfully")
            setIsDialogOpen(false)
        },
        onError: () => toast.error("Failed to add address")
    })

    const updateAddressMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: UpdateAddressInput }) => {
            return await api.patch<Address>(`/addresses/${id}`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-addresses", profile?.id] })
            toast.success("Address updated successfully")
            setIsDialogOpen(false)
        },
        onError: () => toast.error("Failed to update address")
    })

    const deleteAddressMutation = useMutation({
        mutationFn: async (id: number) => {
            return await api.delete(`/addresses/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-addresses", profile?.id] })
            toast.success("Address deleted successfully")
        },
        onError: () => toast.error("Failed to delete address")
    })

    const handleOpenAdd = () => {
        setEditingAddress(null);
        setFormData({
            label: "",
            line1: "",
            line2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            phone: "",
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (address: Address) => {
        setEditingAddress(address);
        setFormData({
            label: address.label || "",
            line1: address.line1,
            line2: address.line2 || "",
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone || "",
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.id) return;

        if (editingAddress) {
            updateAddressMutation.mutate({ id: editingAddress.id, data: formData })
        } else {
            createAddressMutation.mutate(formData)
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        deleteAddressMutation.mutate(id)
    };

    const loading = profileLoading || (!!profile?.id && addressesLoading);

    if (loading) return <div className="text-center py-20">Loading profile...</div>;
    if (!profile) return <div className="text-center py-20">No profile found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">Manage your account settings and addresses.</p>
                </div>
            </div>

            <Separator />

            {/* User Info */}
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
                            <div className="bg-green-500 h-4 w-4 rounded-full border-2 border-background animate-pulse" />
                        </div>
                    </div>

                    {/* User info details */}
                    <div className="flex-1 space-y-6 text-center md:text-left pt-2">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    {profile.name}
                                </h2>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors gap-1.5 py-1 px-3 rounded-full font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified User
                                </Badge>
                            </div>
                            <p className="text-muted-foreground font-medium text-lg leading-none opacity-80">
                                Customer Account
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap items-center md:items-start gap-4 sm:gap-10">
                            <div className="flex items-center gap-3 group/item">
                                <div className="p-2.5 rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover/item:bg-primary/10 group-hover/item:scale-110 transition-all duration-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 leading-none mb-1">Email Address</p>
                                    <p className="font-semibold text-foreground/90">{profile.email}</p>
                                </div>
                            </div>

                            {profile.phone && (
                                <div className="flex items-center gap-3 group/item">
                                    <div className="p-2.5 rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover/item:bg-primary/10 group-hover/item:scale-110 transition-all duration-300">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 leading-none mb-1">Phone Number</p>
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
                            <Pencil className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>
                </div>
            </GlassCard>

            {/* Address Management */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-primary" />
                            My Addresses
                        </h2>
                        <p className="text-sm text-muted-foreground">Manage your shipping and billing addresses.</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="rounded-xl gap-2 shadow-sm hover:shadow-md transition-all">
                        <Plus className="w-4 h-4" /> Add New Address
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.length > 0 ? (
                        addresses.map((address) => (
                            <Card key={address.id} className="relative group border-primary/10 hover:border-primary/30 transition-all">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-bold text-primary">
                                            {address.label || "Address"}
                                        </CardTitle>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                                                onClick={() => handleOpenEdit(address)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() => handleDelete(address.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1 text-muted-foreground">
                                    <p className="font-medium text-foreground">{address.line1}</p>
                                    {address.line2 && <p>{address.line2}</p>}
                                    <p>{address.city}, {address.state} - {address.postalCode}</p>
                                    <p>{address.country}</p>
                                    {address.phone && <p className="pt-2 flex items-center gap-2">📞 {address.phone}</p>}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="col-span-full border-dashed border-2 bg-muted/20">
                            <CardContent className="py-10 text-center flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">No addresses saved yet</p>
                                    <p className="text-sm text-muted-foreground">Add an address to speed up your checkout process.</p>
                                </div>
                                <Button variant="outline" onClick={handleOpenAdd} className="mt-2 rounded-xl">
                                    Add your first address
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Address Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="label">Address Label (Home, Office, etc.)</Label>
                                <Input
                                    id="label"
                                    placeholder="e.g. Home"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="line1">Address Line 1</Label>
                                <Input
                                    id="line1"
                                    placeholder="Street address, P.O. box"
                                    required
                                    value={formData.line1}
                                    onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                                <Input
                                    id="line2"
                                    placeholder="Apartment, suite, unit, etc."
                                    value={formData.line2}
                                    onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    required
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    required
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    required
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="phone">Phone Number (Optional)</Label>
                                <Input
                                    id="phone"
                                    placeholder="For delivery contact"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                                Cancel
                            </Button>
                            <Button type="submit" className="rounded-xl">
                                {editingAddress ? "Update Address" : "Save Address"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
