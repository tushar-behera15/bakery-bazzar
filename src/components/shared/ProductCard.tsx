import { Heart, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";
import GlassCard from "../ui/glass-card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    name: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
    loading?: boolean;
    onAddToCart?: () => void;
}

const ProductCard = ({
    name,
    price,
    image,
    category,
    inStock,
    loading,
    onAddToCart,
}: ProductCardProps) => {
    return (
        <GlassCard
            className="flex flex-col h-full group"
            hover
        >
            {/* Image Container */}
            <div className="relative aspect-4/3 overflow-hidden bg-muted/30">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge
                        variant="secondary"
                        className="bg-background/80 backdrop-blur-md border-none text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-sm"
                    >
                        {category}
                    </Badge>
                </div>

                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground shadow-sm -translate-y-2 group-hover:translate-y-0">
                    <Heart className="h-4 w-4" />
                </button>

                {/* Out of Stock Overlay */}
                {!inStock && (
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <Badge variant="destructive" className="px-4 py-1.5 text-xs font-bold shadow-xl rounded-full">
                            Sold Out
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/40">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-primary tracking-tight">
                            ₹{price.toFixed(0)}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
                            Price inc. tax
                        </span>
                    </div>

                    <Button
                        disabled={!inStock || loading}
                        onClick={onAddToCart}
                        size="icon"
                        className={cn(
                            "h-10 w-10 rounded-xl shadow-soft group-hover:shadow-premium transition-all duration-300 shrink-0",
                            inStock ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground"
                        )}
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        ) : (
                            <Plus className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>
        </GlassCard>
    );
};

export default ProductCard;
