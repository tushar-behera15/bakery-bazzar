import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/components/dashboard-stuffs/theme-provider";
import Navbar from "@/components/shared/Navbar";

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <Navbar />
                {children}
            </ThemeProvider>
        </AuthProvider>
    );
}
