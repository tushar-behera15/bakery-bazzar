import React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    align?: "left" | "center" | "right";
    className?: string;
}

const SectionTitle = ({ title, subtitle, align = "center", className }: SectionTitleProps) => {
    const alignmentClasses = {
        left: "text-left items-start",
        center: "text-center items-center",
        right: "text-right items-end",
    };

    return (
        <div className={cn("flex flex-col mb-10 md:mb-16", alignmentClasses[align], className)}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {title}
                </span>
            </h2>
            {subtitle && (
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-balance">
                    {subtitle}
                </p>
            )}
            <div className="mt-4 h-1.5 w-12 rounded-full bg-primary/20" />
        </div>
    );
};

export default SectionTitle;
