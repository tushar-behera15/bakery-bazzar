'use client'

import { Award, Heart, Users, Star, Coffee, Utensils } from 'lucide-react';
import React from 'react'
import { motion } from 'framer-motion'

const AboutPage = () => {
    const stats = [
        { label: "Happy Customers", value: "10K+", icon: <Users className="h-5 w-5" /> },
        { label: "Expert Bakers", value: "25+", icon: <Award className="h-5 w-5" /> },
        { label: "Fresh Products", value: "50+", icon: <Utensils className="h-5 w-5" /> },
        { label: "Average Rating", value: "4.9/5", icon: <Star className="h-5 w-5" /> },
    ];

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <div className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 mesh-gradient opacity-40 dark:opacity-20 -z-10" />
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl mx-auto"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                Crafted with Passion, <br /> Baked for You
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
                                Bringing artisan baking traditions to the modern world through quality,
                                freshness, and a love for the craft.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <span className="px-6 py-3 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20 backdrop-blur-sm">
                                    Established 2025
                                </span>
                                <span className="px-6 py-3 rounded-full bg-accent/10 text-accent-foreground font-semibold border border-accent/20 backdrop-blur-sm">
                                    Artisan Quality
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center space-y-2 p-6 rounded-2xl bg-background/50 border shadow-sm backdrop-blur-sm"
                                >
                                    <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h2 className="text-lg font-bold text-primary uppercase tracking-widest">Our Story</h2>
                                    <h3 className="text-4xl font-bold leading-tight">Where tradition meets modern innovation</h3>
                                </div>
                                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                                    <p>
                                        Welcome to BakeryBazzar, where every loaf tells a story. We began with a simple belief:
                                        everyone deserves access to artisan-quality baked goods without compromising on
                                        freshness or convenience.
                                    </p>
                                    <p>
                                        Our journey is fueled by a commitment to time-honored baking techniques combined with
                                        modern technology to ensure every product meets our exacting standards.
                                    </p>
                                    <p>
                                        From our signature butter croissants to our hearty sourdough loaves, each item is
                                        made with premium ingredients and baked fresh daily by our skilled artisans.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative lg:h-[500px] flex items-center"
                            >
                                <div className="w-full aspect-square md:aspect-video lg:aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl relative overflow-hidden flex items-center justify-center border-2 border-dashed border-primary/20">
                                    <div className="text-center p-8 space-y-4">
                                        <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-2">
                                            <Coffee className="h-12 w-12" />
                                        </div>
                                        <h4 className="text-2xl font-bold italic text-foreground/80">&quot;Quality is the ingredient <br /> that never goes out of style.&quot;</h4>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 h-48 w-48 bg-primary/10 rounded-full blur-3xl -z-10" />
                                <div className="absolute -top-6 -left-6 h-48 w-48 bg-accent/10 rounded-full blur-3xl -z-10" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-accent/5 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                            <h2 className="text-lg font-bold text-primary uppercase tracking-widest">Our Core Values</h2>
                            <h3 className="text-4xl font-bold">The principles that guide us every day</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Made with Love",
                                    desc: "Every product is crafted with care and attention to detail, ensuring the highest quality in every bite.",
                                    icon: <Heart className="h-8 w-8 text-primary" />,
                                    color: "bg-red-500/10"
                                },
                                {
                                    title: "Community First",
                                    desc: "We source locally and support our community, building relationships that matter and sustain us all.",
                                    icon: <Users className="h-8 w-8 text-primary" />,
                                    color: "bg-blue-500/10"
                                },
                                {
                                    title: "Excellence Always",
                                    desc: "We never compromise on quality, using only the finest ingredients in every legendary recipe.",
                                    icon: <Award className="h-8 w-8 text-primary" />,
                                    color: "bg-amber-500/10"
                                }
                            ].map((value, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    whileHover={{ y: -10 }}
                                    className="p-8 rounded-3xl bg-background border shadow-soft hover:shadow-premium transition-all duration-300 group"
                                >
                                    <div className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {value.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {value.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutPage
