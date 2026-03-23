"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "BUYER" | "SELLER" | "ADMIN";

interface AuthContextType {
    user: { id: number; role: Role; name?: string; email?: string } | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
    requiredRole,
}: {
    children: React.ReactNode;
    requiredRole?: Role;
}) {
    const [user, setUser] = useState<AuthContextType["user"]>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Unauthorized");

                const data = await res.json();
                console.log(data);
                setUser({
                    id: data.user?.id,
                    role: data.user?.role as Role,
                    name: data.user?.name,
                    email: data.user?.email,
                });
            } catch {
                router.replace("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, [requiredRole, router]);

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}



export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth cn be used inside AuthProvider");

    return ctx
} 