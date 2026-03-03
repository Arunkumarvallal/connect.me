import { Skeleton } from '@/components/ui/skeleton';

/**
 * Shown while dashboard/page.tsx resolves.
 * Mirrors the DashboardLayout shell: sidebar + grid.
 * Phase 2: visible while Firestore profile data loads.
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex flex-col w-[560px] shrink-0 min-h-screen border-r border-border/20 p-8 gap-6 items-center">
        <Skeleton className="w-52 h-52 rounded-full mt-8" />
        <Skeleton className="h-7 w-48" />
        <div className="space-y-2 w-full max-w-xs">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-3/6" />
        </div>
      </aside>

      {/* Grid skeleton */}
      <main className="flex-1 p-4">
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="rounded-2xl"
              style={{ height: '160px', gridColumn: i % 3 === 0 ? 'span 2' : 'span 1' }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
