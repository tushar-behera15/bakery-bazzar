import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-muted/30 border-t border-border/40 pt-24 pb-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full -z-0 opacity-10 pointer-events-none">
                <div className="absolute top-20 right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-10 left-[-5%] w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                <span className="text-xl">🥐</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-foreground">
                                Bakery<span className="text-primary italic">Bazzar</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed max-w-xs font-medium">
                            The marketplace for premium artisan baked goods. Connecting you with the finest local bakers since 2025.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-background border border-border/60 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all group"
                                >
                                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-black mb-6 uppercase tracking-[0.2em] text-foreground/80">Navigation</h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Shops", href: "/shops" },
                                { name: "About Us", href: "/about" },
                                { name: "Contact", href: "/contact" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary font-bold transition-all flex items-center group text-sm"
                                    >
                                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-sm font-black mb-6 uppercase tracking-[0.2em] text-foreground/80">My Account</h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Order History", href: "/user/dashboard/orders" },
                                { name: "Shopping Cart", href: "/cart" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary font-bold transition-all flex items-center group text-sm"
                                    >
                                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black mb-6 uppercase tracking-[0.2em] text-foreground/80">Connect</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Email Us</p>
                                    <p className="font-bold text-sm">beheratushar523@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Call Us</p>
                                    <p className="font-bold text-sm">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Visit Us</p>
                                    <p className="font-bold text-sm">Gujarat, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        &copy; {new Date().getFullYear()} Bakery Bazzar. Handcrafted with passion.
                    </p>
                    <div className="flex gap-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
