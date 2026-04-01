import { AuthProvider } from "@/providers/auth-provider";
import Navbar from "@/components/shared/Navbar";

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <Navbar />
            {children}
        </AuthProvider>
    );
}
