'use client';

export default function ProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground">
      <p className="text-lg text-muted-foreground">
        Something went wrong loading this profile.
      </p>
      <button
        onClick={reset}
        className="text-sm underline underline-offset-4 hover:text-foreground transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
