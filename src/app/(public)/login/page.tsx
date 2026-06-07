
'use client';

import type { Transition } from 'framer-motion';
import { motion } from 'framer-motion';
import { Github, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const BRAND = 'Connect.me';

const letterVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35 } as Transition,
  }),
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const uiVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: BRAND.length * 0.04 + 0.2, duration: 0.4 },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);

  async function handleAuth(provider: 'google' | 'github') {
    setLoading(provider);
    try {
      console.log(`[Auth] Attempting ${provider} sign-in...`);
      const user = await signIn(provider);
      console.log(`[Auth] Sign-in successful:`, user.uid, user.email);
      
      // Check if user has a profile in Firestore
      console.log(`[Firestore] Checking for profile: users/${user.uid}`);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        console.log(`[Firestore] Profile found, redirecting to dashboard`);
        toast.success(`Welcome back, ${user.displayName}!`);
        router.push('/dashboard');
      } else {
        // New user - redirect to onboarding
        console.log(`[Firestore] No profile found, redirecting to onboarding`);
        toast.success('Welcome! Let\'s set up your profile.');
        router.push('/onboarding');
      }
    } catch (error: any) {
      console.error('[Auth] Error:', error);
      
      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info('Sign-in cancelled');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account already exists with this email. Try another sign-in method.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized. Add localhost to Firebase Console > Auth > Settings > Authorized domains');
      } else if (error.code === 'auth/invalid-api-key') {
        toast.error('Invalid Firebase API key. Check .env.local file.');
      } else {
        toast.error(`Sign-in failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-10 px-6">
        <motion.h1
          className="text-5xl md:text-7xl font-black tracking-tighter select-none"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label={BRAND}
        >
          {BRAND.split('').map((char, i) => (
            <motion.span key={i} custom={i} variants={letterVariants} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          className="flex flex-col gap-3 w-full max-w-xs"
          variants={uiVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-center text-sm text-muted-foreground mb-2">
            Your personal link-in-bio, beautifully arranged.
          </p>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleAuth('google')}
            disabled={loading !== null}
          >
            {loading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleAuth('github')}
            disabled={loading !== null}
          >
            {loading === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            {loading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-2">
            By continuing you agree to our terms.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
