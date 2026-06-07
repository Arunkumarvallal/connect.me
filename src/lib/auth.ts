'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  AuthError,
  getIdToken,
  setPersistence,
  browserLocalPersistence,
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from './firebase';
import { useRouter } from 'next/navigation';

export type AuthProvider = 'google' | 'github';

// Set persistence to local storage on init
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('[Auth] Failed to set persistence:', err);
});

// Module-level signOut function
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    console.log('[Auth] Signed out');
    // Clear cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  } catch (err) {
    console.error('[Auth] Sign-out error:', err);
    throw err;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Check for redirect result first (handles popup→redirect fallback)
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log('[Auth] Redirect sign-in successful:', result.user.uid);
        // Will be handled by onAuthStateChanged below
      }
    }).catch((err) => {
      console.error('[Auth] Redirect result error:', err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[Auth] State changed:', user?.uid || 'null');
      setUser(user);
      setLoading(false);
      setError(null);
      
      // Set auth cookie when user signs in
      if (user) {
        try {
          const token = await getIdToken(user, true); // Force refresh
          console.log('[Auth] Got ID token, setting cookie');
          // Set cookie for middleware (expires in 1 hour)
          document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Lax`;
        } catch (err) {
          console.error('[Auth] Failed to get ID token:', err);
        }
      } else {
        // Clear cookie on sign out
        document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (provider: AuthProvider) => {
    setError(null);
    try {
      const authProvider = provider === 'google' ? googleProvider : githubProvider;
      console.log(`[Auth] Attempting ${provider} sign-in...`);
      const result = await signInWithPopup(auth, authProvider);
      
      // Get ID token and set cookie
      const token = await getIdToken(result.user, true);
      document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Lax`;
      console.log('[Auth] Sign-in successful:', result.user.uid);
      
      return result.user;
    } catch (err: any) {
      console.error('[Auth] Sign-in error:', err);
      setError(err as AuthError);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      console.log('[Auth] Signed out');
      // Clear cookie
      document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (err) {
      console.error('[Auth] Sign-out error:', err);
      setError(err as AuthError);
      throw err;
    }
  }, []);

  return { user, loading, error, signIn, signOut };
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log('[Auth] No user, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  return { user, loading };
}
