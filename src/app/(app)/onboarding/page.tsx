'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';
import { BIO_MAX_CHARS } from '@/types/profile';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated or already has a profile (onboarding complete)
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      setDisplayName(user.displayName || '');
      
      // Check if user already has a profile (already completed onboarding)
      const checkProfile = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log('[Onboarding] Profile already exists, redirecting to dashboard');
            toast.info('You have already set up your profile');
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('[Onboarding] Error checking profile:', error);
        }
      };
      checkProfile();
    }
  }, [user, loading, router]);

  // Debounced username check
  const checkUsername = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeout);
        const trimmed = value.trim().toLowerCase();
        
        if (!trimmed) {
          setUsernameStatus('idle');
          return;
        }
        
        if (!/^[a-z0-9_-]{3,20}$/.test(trimmed)) {
          setUsernameStatus('invalid');
          return;
        }

        setUsernameStatus('checking');
        timeout = setTimeout(async () => {
          try {
            // Check if username exists in Firestore
            // Note: In production, you'd want a separate usernames collection for efficient lookups
            const docRef = doc(db, 'usernames', trimmed);
            const docSnap = await getDoc(docRef);
            setUsernameStatus(docSnap.exists() ? 'taken' : 'available');
          } catch (error) {
            console.error('Username check failed:', error);
            setUsernameStatus('idle');
          }
        }, 500);
      };
    })(),
    []
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(value);
    checkUsername(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usernameStatus !== 'available') {
      toast.error('Please choose a valid username');
      return;
    }

    if (!user) {
      toast.error('You must be signed in');
      return;
    }

    setSaving(true);
    try {
      // Use Google OAuth profile picture (or empty string if not available)
      const avatarUrl = user.photoURL || '';

      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        username: username.trim().toLowerCase(),
        displayName: displayName || user.displayName || '',
        avatarUrl,
        bio: bio.slice(0, BIO_MAX_CHARS),
        theme: {
          mode: 'light' as const,
          font: 'sans' as const,
          background: 'white' as const,
        },
        socialLinks: {},
        tiles: [],
        createdAt: serverTimestamp(),
      };

      // Save to users collection
      await setDoc(doc(db, 'users', user.uid), userProfile);

      // Reserve username
      await setDoc(doc(db, 'usernames', username.trim().toLowerCase()), {
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      toast.success('Profile created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(`Failed to create profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Set up your profile</h1>
          <p className="text-muted-foreground mt-2">
            Choose your unique username and customize your profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.photoURL || ''} alt="Avatar preview" />
              <AvatarFallback className="text-2xl">
                {displayName?.[0] || user?.email?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground text-center">
              Using your Google account photo
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                connect.me/
              </span>
              <Input
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="pl-32"
                placeholder="yourname"
                required
                minLength={3}
                maxLength={20}
              />
              {usernameStatus === 'checking' && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
              )}
              {usernameStatus === 'available' && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
              {usernameStatus === 'taken' && (
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              )}
            </div>
            {usernameStatus === 'invalid' && (
              <p className="text-sm text-red-500">
                Username must be 3-20 characters (letters, numbers, _ or -)
              </p>
            )}
            {usernameStatus === 'taken' && (
              <p className="text-sm text-red-500">This username is already taken</p>
            )}
            {usernameStatus === 'available' && (
              <p className="text-sm text-green-500">Username is available!</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX_CHARS))}
              placeholder="Tell people about yourself..."
              maxLength={BIO_MAX_CHARS}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/{BIO_MAX_CHARS}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={saving || usernameStatus !== 'available'}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating profile...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
