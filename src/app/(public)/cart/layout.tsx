import { AuthProvider } from "@/providers/auth-provider";

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
