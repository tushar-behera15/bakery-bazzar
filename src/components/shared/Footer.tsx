import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoImage from "@/assets/croissant.jpg";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 pt-16 relative">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* About Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Image src={logoImage} alt="Bakery Bazzar" width={40} height={40} className="rounded-full" />
                        <h2 className="text-2xl font-bold text-white">Bakery Bazzar</h2>
                    </div>
                    <p className="text-gray-400">
                        Bakery Bazzar is your one-stop destination for fresh, handcrafted baked goods delivered right to your door. Quality and freshness are our top priorities.
                    </p>
                    <div className="flex gap-3 mt-2">
                        <a href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>

                    </ul>
                </div>

                {/* Products Links */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Products</h3>
                    <ul className="space-y-2">
                        <li><Link href="/products#bread" className="hover:text-white transition-colors">Bread</Link></li>
                        <li><Link href="/products#pastry" className="hover:text-white transition-colors">Pastries</Link></li>
                        <li><Link href="/products#cake" className="hover:text-white transition-colors">Cakes</Link></li>
                        <li><Link href="/products#cupcake" className="hover:text-white transition-colors">Cupcakes</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="text-gray-400">info@bakerybazzar.com</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-5 w-5 text-primary" />
                        <span className="text-gray-400">+91 98765 43210</span>
                    </div>
                    <p className="text-gray-400 mt-2">
                        123 Bakery Street, Sweet City, India
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 pt-3">
                <p className="text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Bakery Bazzar. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
