"use client"

import AccessDenied from "@/components/shared/AccessDenied";
import { useAuth } from "@/providers/auth-provider";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    if (user?.role == "ADMIN")
        return children;
    else return (
        <div>
            <AccessDenied />
        </div>
    )

}
