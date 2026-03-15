import { IconTrendingDown, IconTrendingUp, IconUsers, IconCurrencyRupee, IconChartLine, IconCreditCard } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import GlassCard from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

const stats = [
    {
        title: "Total Revenue",
        value: "₹82,540.00",
        change: "+18.7%",
        trend: "up",
        icon: IconCurrencyRupee,
        description: "Compared to ₹69,480.00 last month",
        color: "text-green-500",
        bgColor: "bg-green-500/10"
    },
    {
        title: "New Customers",
        value: "1,234",
        change: "-20%",
        trend: "down",
        icon: IconUsers,
        description: "Only 1,234 vs 1,540 last month",
        color: "text-red-500",
        bgColor: "bg-red-500/10"
    },
    {
        title: "Active Accounts",
        value: "45,678",
        change: "+12.5%",
        trend: "up",
        icon: IconChartLine,
        description: "User retention is up by 5%",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        title: "Growth Rate",
        value: "4.5%",
        change: "+4.5%",
        trend: "up",
        icon: IconCreditCard,
        description: "Steady performance increase",
        color: "text-primary",
        bgColor: "bg-primary/10"
    }
]

export function SectionCards() {
    return (
        <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {stats.map((stat, idx) => (
                <GlassCard key={idx} className="p-6 group" hover>
                    <div className="flex justify-between items-start mb-4">
                        <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300", stat.bgColor, stat.color)}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <Badge 
                            variant="secondary" 
                            className={cn(
                                "font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 border-none shadow-sm",
                                stat.trend === "up" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                            )}
                        >
                            <span className="flex items-center gap-1">
                                {stat.trend === "up" ? <IconTrendingUp className="h-3 w-3" /> : <IconTrendingDown className="h-3 w-3" />}
                                {stat.change}
                            </span>
                        </Badge>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/40">
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            {stat.description}
                        </p>
                    </div>
                </GlassCard>
            ))}
        </div>
    )
}
