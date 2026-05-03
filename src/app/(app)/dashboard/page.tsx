'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/lib/auth';
import { useProfileStore } from '@/store/profile-store';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { loadProfileFromFirestore, startFirestoreSync } = useProfileStore();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load profile from Firestore and start real-time sync when user is authenticated
  useEffect(() => {
    if (user?.uid) {
      console.log('[Dashboard] Loading profile for user:', user.uid);
      loadProfileFromFirestore(user.uid).then(() => {
        startFirestoreSync(user.uid);
      });
    }
  }, [user?.uid, loadProfileFromFirestore, startFirestoreSync]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // useEffect will redirect
  }
  
  return <DashboardLayout />;
}
