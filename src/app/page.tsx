
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Grid3X3, Layers, Palette, ShieldCheck } from 'lucide-react';

export default function Home() {
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
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Login
          </Link>
          <Button asChild className="rounded-full px-6">
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 lg:py-32 xl:py-48 px-6 lg:px-12 flex flex-col items-center text-center space-y-8 bg-gradient-mesh">
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
              <Link href="/johndoe">View Demo</Link>
            </Button>
          </div>
        </section>

        <section className="w-full py-20 px-6 lg:px-12 bg-background border-t">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/5 rounded-2xl">
                <Layers className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-headline">Bento Grid</h3>
              <p className="text-muted-foreground">Arrange your content in a stunning, responsive grid system.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/5 rounded-2xl">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-headline">Custom Themes</h3>
              <p className="text-muted-foreground">Personalize everything from gradients to curated typography.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/5 rounded-2xl">
                <Grid3X3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-headline">Widget Library</h3>
              <p className="text-muted-foreground">Embed Spotify, GitHub, YouTube, and more with live API data.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/5 rounded-2xl">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-headline">Fast & Secure</h3>
              <p className="text-muted-foreground">Blazing fast performance with SEO-friendly public profiles.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-12 px-6 lg:px-12 border-t text-center text-sm text-muted-foreground">
        <p>© 2024 Connect.me. Built for creatives and professionals.</p>
      </footer>
    </div>
  );
}
