import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Grid3X3, Layers, Palette, ShieldCheck, LayoutDashboard, Sparkles, Zap, Users } from 'lucide-react';
import { mockProfile } from '@/lib/mock-data';
import { cookies } from 'next/headers';
import { BentoCard } from '@/components/ui/bento-card';
import { BentoHero } from '@/components/profile/bento-hero';

const DEMO_USERNAME = mockProfile.username;

export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('firebase-auth-token')?.value;
  const isAuthenticated = !!authToken;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Grid3X3 className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight font-headline">Connect.me</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
          {isAuthenticated ? (
            <>
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="/dashboard">
                Dashboard
              </Link>
              <Button asChild className="rounded-full px-6">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
                Login
              </Link>
              <Button asChild className="rounded-full px-6">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="w-full py-20 lg:py-32 xl:py-40 px-6 lg:px-12 flex flex-col items-center text-center space-y-8 bg-gradient-mesh">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-headline leading-tight">
              One link to <span className="text-primary/70">everything</span> you do.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-xl md:text-2xl font-light">
              Build a beautiful, modular profile page that showcases your personal brand, projects, and social links in minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="rounded-full px-8 text-lg h-14">
              <Link href="/login">
                Claim your URL <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full px-8 text-lg h-14 bg-background/50 backdrop-blur">
              <Link href={`/${DEMO_USERNAME}`}>View Demo</Link>
            </Button>
          </div>
        </section>

        {/* Bento showcase */}
        <section className="w-full py-20 px-6 lg:px-12 bg-background border-t">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-headline">
                Built like a bento.
              </h2>
              <p className="text-muted-foreground text-lg">
                Every tile is a card. Mix, match, resize, and rearrange. Your profile, your layout.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[10rem] sm:auto-rows-[12rem] lg:auto-rows-[13rem] gap-4">
              <div className="lg:col-span-2 lg:row-span-2">
                <BentoCard
                  href={`/${DEMO_USERNAME}`}
                  variant="gradient"
                  className="h-full"
                >
                  <div className="w-full h-full p-6 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <p className="text-2xl font-bold leading-tight">Bento grid layouts</p>
                      <p className="text-sm opacity-80 mt-2">
                        Drag, drop, resize. Every tile snaps to a clean grid with no awkward gaps.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold">
                      Live demo <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </BentoCard>
              </div>

              <div className="lg:col-span-2">
                <BentoCard variant="image" imageUrl="https://picsum.photos/seed/bento1/800/400" href={`/${DEMO_USERNAME}`} className="h-full">
                  <div className="w-full h-full flex items-end" />
                </BentoCard>
              </div>

              <BentoCard variant="plain" href={`/${DEMO_USERNAME}`} className="h-full">
                <div className="w-full h-full p-5 flex flex-col justify-between">
                  <Palette className="w-7 h-7 text-violet-500" />
                  <div>
                    <p className="text-sm font-bold">Custom themes</p>
                    <p className="text-[11px] text-muted-foreground mt-1">6 background presets + custom fonts.</p>
                  </div>
                </div>
              </BentoCard>

              <BentoCard variant="glow" href={`/${DEMO_USERNAME}`} className="h-full">
                <div className="w-full h-full p-5 flex flex-col justify-between">
                  <Zap className="w-7 h-7 text-amber-500" />
                  <div>
                    <p className="text-sm font-bold">Instant publish</p>
                    <p className="text-[11px] text-muted-foreground mt-1">No build, no deploy. Just share your URL.</p>
                  </div>
                </div>
              </BentoCard>

              <div className="lg:col-span-2">
                <BentoCard variant="image" imageUrl="https://picsum.photos/seed/bento2/800/400" href={`/${DEMO_USERNAME}`} className="h-full">
                  <div className="w-full h-full flex items-end" />
                </BentoCard>
              </div>

              <BentoCard variant="plain" href={`/${DEMO_USERNAME}`} className="h-full">
                <div className="w-full h-full p-5 flex flex-col justify-between">
                  <Users className="w-7 h-7 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold">Socials in one place</p>
                    <p className="text-[11px] text-muted-foreground mt-1">GitHub, LinkedIn, X — all in one card.</p>
                  </div>
                </div>
              </BentoCard>

              <BentoCard variant="gradient" href={`/${DEMO_USERNAME}`} className="h-full">
                <div className="w-full h-full p-5 flex flex-col justify-between">
                  <ShieldCheck className="w-7 h-7" />
                  <div>
                    <p className="text-sm font-bold">SEO-friendly</p>
                    <p className="text-[11px] opacity-80 mt-1">Renders fast, indexes well.</p>
                  </div>
                </div>
              </BentoCard>
            </div>
          </div>
        </section>

        {/* Live preview hero */}
        <section className="w-full py-20 px-6 lg:px-12 bg-zinc-50 dark:bg-zinc-900/50 border-t">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-headline">
                See it in action.
              </h2>
              <p className="text-muted-foreground text-lg">
                A peek at the live profile layout — sticky-left hero, bento tiles, custom accent.
              </p>
            </div>
            <BentoHero profile={mockProfile} readOnly />
            <div className="text-center">
              <Button size="lg" asChild className="rounded-full px-8 text-lg h-14">
                <Link href={`/${DEMO_USERNAME}`}>
                  Open full demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 lg:px-12 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Connect.me. Built for creatives and professionals.</p>
      </footer>
    </div>
  );
}
