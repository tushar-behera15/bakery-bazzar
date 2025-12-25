import { ThemeProvider } from "@/components/dashboard-stuffs/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange>

                {children}
            </ThemeProvider>
        </AuthProvider>
    );
}
