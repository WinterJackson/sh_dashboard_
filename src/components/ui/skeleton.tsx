// src/components/ui/skeleton.tsx

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md mt-2 mb-2 bg-slate-200", className)}
      {...props}
    />
  )
}

export { Skeleton }
