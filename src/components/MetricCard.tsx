import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  subtitle?: string;
  trend?: "up" | "down";
}

export function MetricCard({ title, value, change, icon, subtitle, trend }: MetricCardProps) {
  const isPositive = trend === "up";
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div>{value}</div>
          {change !== undefined && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {isPositive ? (
                <ArrowUp className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-600" />
              )}
              <span className={isPositive ? "text-green-600" : "text-red-600"}>
                {Math.abs(change)}%
              </span>
              <span>from last month</span>
            </div>
          )}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
