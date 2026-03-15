import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hover?: boolean;
}

const GlassCard = ({ children, className, hover = true, ...props }: GlassCardProps) => {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl",
                "bg-card/40 backdrop-blur-lg border border-border shadow-sm",
                hover && "transition-all duration-300 hover:shadow-premium hover:-translate-y-1 hover:border-primary/20 hover:bg-card/60",
                className
            )}
            {...props}
        >
            {/* Subtle inner light effect */}
            <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/10 to-transparent dark:from-white/5 opacity-50" />
            
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default GlassCard;
