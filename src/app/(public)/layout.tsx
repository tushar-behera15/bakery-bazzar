import { ThemeProvider } from "@/components/dashboard-stuffs/theme-provider";
import Navbar from "@/components/shared/Navbar";


export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>

        <Navbar />
        {children}
      </ThemeProvider>

    </>
  );
}
