import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata: Metadata = {
  title: "Dashboard | BakeryBazzar",
  description: "Manage your shop, products and orders",
};

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider requiredRole="BUYER">
      <DashboardClient>
        {children}
      </DashboardClient>
    </AuthProvider>
  )

}
