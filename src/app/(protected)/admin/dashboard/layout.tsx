import type { Metadata } from "next";
import DashboardClient from "./AdminDashboardClient";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata: Metadata = {
  title: "Dashboard | BakeryBazzar",
  description: "Manage your shop, products and orders",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider requiredRole="ADMIN">
      <DashboardClient>
        {children}
      </DashboardClient>
    </AuthProvider>
  )

}
