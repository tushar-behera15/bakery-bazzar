import { Award, Heart, Users } from 'lucide-react';
import React from 'react'

const AboutPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1">
                {/* Hero */}
                <section className="bg-gradient-hero py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-bold mb-4">About BakeryBazzar</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Bringing artisan baking traditions to the modern world
                        </p>
                    </div>
                </section>

                {/* Story */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto space-y-6 text-lg">
                            <p>
                                Welcome to BakeryBazzar, where tradition meets innovation. Since 2025, we&apos;ve been committed
                                to bringing you the finest baked goods, crafted with passion and delivered fresh to your doorstep.
                            </p>
                            <p>
                                Our journey began with a simple belief: everyone deserves access to artisan-quality baked goods
                                without compromising on freshness or convenience. We combine time-honored baking techniques with
                                modern technology to ensure every product meets our exacting standards.
                            </p>
                            <p>
                                From our signature butter croissants to our hearty sourdough loaves, each item is made with
                                premium ingredients and baked fresh daily by our skilled artisans.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-16 bg-accent/30">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                                    <Heart className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Made with Love</h3>
                                <p className="text-muted-foreground">
                                    Every product is crafted with care and attention to detail, ensuring the highest quality
                                </p>
                            </div>

                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Community First</h3>
                                <p className="text-muted-foreground">
                                    We source locally and support our community, building relationships that matter
                                </p>
                            </div>

                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                                    <Award className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Excellence Always</h3>
                                <p className="text-muted-foreground">
                                    We never compromise on quality, using only the finest ingredients in every recipe
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    );
}

export default AboutPage