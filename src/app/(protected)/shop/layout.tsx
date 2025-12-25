"use client"

import AccessDenied from "@/components/shared/AccessDenied";
import { useAuth } from "@/providers/auth-provider";

export default function SellerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    if (user?.role == "SELLER")
        return children;
    else return (
        <div>
            <AccessDenied />
        </div>
    )

}
