"use client"

import AccessDenied from "@/components/shared/AccessDenied";
import { useAuth } from "@/providers/auth-provider";

export default function BuyerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    if (user?.role == "BUYER")
        return children;
    else return (
        <div>
            <pre>{user?.role}</pre>
            <AccessDenied />
        </div>
    )

}
