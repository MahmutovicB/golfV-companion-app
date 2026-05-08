import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Variant = "low" | "medium" | "high" | "default" | "success"

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  low: "bg-green-900/50 text-green-400 border-green-800",
  medium: "bg-yellow-900/50 text-yellow-400 border-yellow-800",
  high: "bg-red-900/50 text-red-400 border-red-800",
  default: "bg-zinc-800 text-zinc-300 border-zinc-700",
  success: "bg-green-900/50 text-green-400 border-green-800",
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
