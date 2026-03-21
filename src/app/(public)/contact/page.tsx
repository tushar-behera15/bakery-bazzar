'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle, Instagram, Twitter, Facebook } from "lucide-react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Contact = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Contact form submitted");
    };

    const contactMethods = [
        {
            icon: <Phone className="h-6 w-6" />,
            title: "Phone",
            value: "+1 234 567 890",
            desc: "Mon-Fri from 7am to 7pm",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Email",
            value: "hello@bakerybazzar.com",
            desc: "We&apos;ll respond within 24 hours",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            icon: <MapPin className="h-6 w-6" />,
            title: "Office",
            value: "123 Bakery Street",
            desc: "Sweet City, SC 12345",
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ];

    const faqs = [
        {
            q: "How do I place an order?",
            a: "You can place an order directly through our website by browsing our shops and adding items to your cart. Once you're ready, proceed to checkout."
        },
        {
            q: "What are your delivery hours?",
            a: "Our delivery hours are from 8:00 AM to 6:00 PM daily. You can select your preferred delivery time during checkout."
        },
        {
            q: "Do you offer gluten-free options?",
            a: "Yes! Many of our partner bakeries offer certified gluten-free options. You can use the search filters to find specific dietary requirements."
        },
        {
            q: "Can I cancel my order?",
            a: "Orders can be cancelled up to 2 hours before the scheduled delivery time for a full refund. Please contact the bakery directly for last-minute changes."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <div className="flex-1">
                {/* Header Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 mesh-gradient opacity-40 dark:opacity-20 -z-10" />
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-2xl mx-auto space-y-4"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Get in Touch</h1>
                            <p className="text-xl text-muted-foreground">
                                Have questions about our products or services? <br className="hidden md:block" />
                                We&apos;re here to help you every step of the way.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Contact Content */}
                <section className="py-20 bg-background relative">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-5 gap-16">
                            {/* Contact Info (2 cols) */}
                            <div className="lg:col-span-2 space-y-10">
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold">Contact Information</h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Fill out the form and our team will get back to you within 24 hours.
                                        Or use any of the contact methods below.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {contactMethods.map((method, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors duration-300"
                                        >
                                            <div className={`p-3 rounded-xl ${method.bg} ${method.color}`}>
                                                {method.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{method.title}</h3>
                                                <p className="text-foreground font-medium">{method.value}</p>
                                                <p className="text-sm text-muted-foreground">{method.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="pt-6 space-y-4">
                                    <h3 className="font-bold text-lg underline decoration-primary underline-offset-4">Follow Us</h3>
                                    <div className="flex gap-4">
                                        {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                            <motion.a
                                                key={i}
                                                href="#"
                                                whileHover={{ y: -5, scale: 1.1 }}
                                                className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                            >
                                                <Icon className="h-5 w-5" />
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form (3 cols) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="lg:col-span-3"
                            >
                                <Card className="border-none shadow-premium glass-card overflow-hidden">
                                    <CardHeader className="bg-primary/5 border-b border-primary/10 pb-8">
                                        <CardTitle className="text-2xl flex items-center gap-2">
                                            <MessageSquare className="h-6 w-6 text-primary" />
                                            Send us a message
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground/80">
                                            We&apos;d love to hear from you. Tell us more about your thoughts or questions.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-8 p-8">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                                                    <Input id="name" placeholder="John Doe" className="bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                                                    <Input id="email" type="email" placeholder="john@example.com" className="bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300" required />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subject" className="text-sm font-semibold">Subject</Label>
                                                <Input id="subject" placeholder="What is this regarding?" className="bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300" required />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message" className="text-sm font-semibold">Your Message</Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="Tell us how we can help you..."
                                                    className="bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300 min-h-[150px]"
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 group">
                                                Send Message
                                                <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-lg font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-2">
                                    <HelpCircle className="h-5 w-5" />
                                    FAQs
                                </h2>
                                <h3 className="text-4xl font-bold">Frequently Asked Questions</h3>
                            </div>

                            <div className="p-8 rounded-3xl bg-background border shadow-soft">
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, i) => (
                                        <AccordionItem value={`item-${i}`} key={i} className="border-b border-muted last:border-0">
                                            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                                                {faq.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Contact;
