'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  const { user, loading, error, signIn, signOut } = useAuth();
  const [firestoreTest, setFirestoreTest] = useState<string>('');
  const [configStatus, setConfigStatus] = useState<string>('');

  useEffect(() => {
    // Check Firebase config
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey || apiKey.includes('PASTE') || apiKey.includes('AIza')) {
      setConfigStatus(`✅ API Key found: ${apiKey?.slice(0, 10)}...`);
    } else {
      setConfigStatus('❌ API Key missing or invalid');
    }
  }, []);

  async function testFirestore() {
    if (!user) {
      setFirestoreTest('❌ Not signed in');
      return;
    }
    
    try {
      setFirestoreTest('⏳ Testing Firestore...');
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setFirestoreTest(`✅ Firestore works! Profile found.`);
      } else {
        setFirestoreTest(`⚠️ Firestore works, but no profile found for ${user.uid}`);
      }
    } catch (error: any) {
      console.error('Firestore test error:', error);
      setFirestoreTest(`❌ Firestore error: ${error.message}`);
    }
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Firebase Debug Page</h1>
        
        {/* Config Status */}
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">1. Configuration</h2>
          <p className="text-sm">{configStatus || 'Checking...'}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Missing'}</p>
            <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ Missing'}</p>
          </div>
        </div>

        {/* Auth Status */}
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">2. Authentication</h2>
          {loading ? (
            <p>⏳ Loading...</p>
          ) : user ? (
            <div>
              <p>✅ Signed in as: {user.displayName || user.email}</p>
              <p className="text-sm text-muted-foreground">UID: {user.uid}</p>
              <Button onClick={() => signOut()} className="mt-2" variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p>❌ Not signed in</p>
              <div className="flex gap-2">
                <Button onClick={() => signIn('google')} size="sm">
                  Sign in with Google
                </Button>
                <Button onClick={() => signIn('github')} size="sm" variant="outline">
                  Sign in with GitHub
                </Button>
              </div>
            </div>
          )}
          {error && (
            <p className="text-sm text-red-500 mt-2">Error: {error.message}</p>
          )}
        </div>

        {/* Firestore Test */}
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">3. Firestore Test</h2>
          <Button onClick={testFirestore} size="sm" disabled={!user}>
            Test Firestore Connection
          </Button>
          {firestoreTest && (
            <p className="text-sm mt-2">{firestoreTest}</p>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <h2 className="font-semibold mb-2">📋 Troubleshooting</h2>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Make sure `.env.local` has correct Firebase config values</li>
            <li>Restart dev server after changing `.env.local`</li>
            <li>Add `localhost` to Firebase Console → Auth → Settings → Authorized domains</li>
            <li>Check browser console for detailed errors</li>
            <li>Verify Firestore Database is created in Firebase Console</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
