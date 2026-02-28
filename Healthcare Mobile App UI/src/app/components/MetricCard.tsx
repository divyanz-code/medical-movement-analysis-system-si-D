import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  variant?: "default" | "accent" | "success" | "warning";
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  variant = "default",
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-card border border-border",
    accent: "bg-accent/10 border border-accent/20",
    success: "bg-success/10 border border-success/20",
    warning: "bg-warning/10 border border-warning/20",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
  };

  return (
    <Card className={`p-4 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${iconStyles[variant]}`} />
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-foreground">
              {value}
            </span>
            {unit && (
              <span className="text-lg text-muted-foreground">{unit}</span>
            )}
          </div>
        </div>
        {trend && (
          <div className="mt-1">
            {trend === "up" && (
              <div className="text-success text-xs">↑ Improving</div>
            )}
            {trend === "down" && (
              <div className="text-destructive text-xs">↓ Declining</div>
            )}
            {trend === "stable" && (
              <div className="text-muted-foreground text-xs">→ Stable</div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
