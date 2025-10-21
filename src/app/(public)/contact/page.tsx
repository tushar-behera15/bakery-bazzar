'use client'
// import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Contact form submitted");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1">
                {/* Header */}
                <section className="bg-gradient-hero py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions? We&apos;d love to hear from you
                        </p>
                    </div>
                </section>

                {/* Contact Content */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send us a message</CardTitle>
                                    <CardDescription>Fill out the form below and we&apos;ll get back to you soon</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" placeholder="Your name" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="you@example.com" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" placeholder="How can we help?" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Your message..."
                                                rows={6}
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Contact Info */}
                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-full bg-primary/10">
                                                    <Phone className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-1">Phone</h3>
                                                    <p className="text-muted-foreground">+1 234 567 890</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-full bg-primary/10">
                                                    <Mail className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-1">Email</h3>
                                                    <p className="text-muted-foreground">info@bakerybazzar.com</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-full bg-primary/10">
                                                    <MapPin className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-1">Address</h3>
                                                    <p className="text-muted-foreground">123 Bakery Street<br />Sweet City, SC 12345</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-full bg-primary/10">
                                                    <Clock className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-1">Business Hours</h3>
                                                    <p className="text-muted-foreground">
                                                        Mon - Fri: 7:00 AM - 7:00 PM<br />
                                                        Sat - Sun: 8:00 AM - 6:00 PM
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* <Footer /> */}
        </div>
    );
};

export default Contact;
