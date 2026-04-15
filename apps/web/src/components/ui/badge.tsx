import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "dark" | "light" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-brand-dark text-white border-transparent",
    secondary: "bg-brand-light text-brand-dark border-transparent",
    outline: "border-gray-200 text-gray-500",
    dark: "bg-brand-black text-white border-transparent",
    light: "bg-brand-lightest text-brand-dark border-transparent",
    success: "bg-emerald-500 text-white border-transparent",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
