import { Skeleton } from '@/components/ui/skeleton';

/**
 * Shown while [username]/page.tsx resolves.
 * Mirrors the PublicProfile layout: sidebar + grid area.
 * Phase 2: will be visible while Firestore data loads.
 */
export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar skeleton */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 min-h-screen border-r border-border/40 p-6 gap-4">
        <div className="flex flex-col items-center gap-4 mt-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        </div>
      </aside>

      {/* Grid area skeleton */}
      <main className="flex-1 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="rounded-2xl"
              style={{ height: i % 3 === 0 ? '320px' : '160px', gridColumn: i % 3 === 0 ? 'span 2' : 'span 1' }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
