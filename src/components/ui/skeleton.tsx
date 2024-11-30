// src/components/ui/skeleton.tsx

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md mt-2 mb-2 bg-gray-100", className)}
      {...props}
    />
  )
}

export { Skeleton }
