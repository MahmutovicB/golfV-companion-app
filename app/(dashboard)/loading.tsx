import { StatsSkeleton, ListSkeleton, Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48 mt-1" />
      </div>
      <StatsSkeleton />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <Skeleton className="h-5 w-40" />
          <ListSkeleton count={3} />
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <Skeleton className="h-5 w-40" />
          <ListSkeleton count={3} />
        </div>
      </div>
    </div>
  )
}
