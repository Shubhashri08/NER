import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)]",
        secondary:
          "border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]",
        critical:
          "border border-[#EF4444]/40 bg-[#EF4444]/15 text-[#EF4444] font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]",
        warning:
          "border border-[var(--ring)]/40 bg-[var(--ring)]/15 text-[var(--ring)] font-bold shadow-[0_0_8px_rgba(212,175,55,0.15)]",
        success:
          "border border-[#2E7D32]/50 bg-[#2E7D32]/15 text-[var(--primary)] font-bold shadow-[0_0_8px_rgba(46,125,50,0.15)]",
        info:
          "border border-[#3B82F6]/40 bg-[#3B82F6]/15 text-[#3B82F6] font-bold",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
