"use client"

import { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard-stuffs/app-sidebar"
import { SiteHeader } from "@/components/dashboard-stuffs/site-header"
import { AuthProvider, useAuth } from "@/providers/auth-provider"
import { IconAlertTriangle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

interface DashboardLayoutProps {
  children: ReactNode
}

function DashboardContent({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user?.role === "SELLER" && user.isShopActive === false) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4 bg-muted/30">
        <div className="max-w-md w-full bg-background rounded-3xl border shadow-premium p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
            <IconAlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Access Restricted</h1>
            <p className="text-muted-foreground">
              Your shop has been deactivated by an administrator. You currently do not have access to the dashboard.
            </p>
          </div>
          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function ShopDashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider requiredRole="SELLER">
      <DashboardContent>
        {children}
      </DashboardContent>
    </AuthProvider>
  )
}
