import * as React from "react"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
  className?: string;
}

export function StatCard({ title, value, unit, icon: Icon, trend, className }: StatCardProps) {
  const trendColors = {
    positive: "text-emerald-500 bg-emerald-50",
    negative: "text-red-500 bg-red-50",
    neutral: "text-gray-500 bg-gray-50",
  };

  const TrendIcon = trend?.type === "positive" ? TrendingUp : trend?.type === "negative" ? TrendingDown : Minus;

  return (
    <Card className={cn("p-6 hover:shadow-md transition-shadow", className)}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-light/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-dark" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <h3 className="text-2xl font-bold text-brand-black">{value}</h3>
        {unit && <span className="text-sm font-medium text-gray-400">{unit}</span>}
      </div>

      {trend && (
        <div className="flex items-center gap-2 mt-4">
          <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold", trendColors[trend.type])}>
            <TrendIcon className="w-3 h-3" />
            {trend.value}
          </div>
          <p className="text-[11px] text-gray-400">vs last month</p>
        </div>
      )}
    </Card>
  );
}
