import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockProfile } from '@/lib/mock-data';
import { PublicProfile } from '@/components/profile/public-profile';

type Props = { params: Promise<{ username: string }> };

// Phase 2: replace mock lookup with Firestore query by username.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  if (username !== mockProfile.username) {
    return { title: 'Profile not found | Connect.me' };
  }
  return {
    title: `${mockProfile.displayName} (@${username}) | Connect.me`,
    description: mockProfile.bio,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  // Phase 2: replace with Firestore lookup by username.
  if (username !== mockProfile.username) {
    notFound();
  }

  return <PublicProfile profile={mockProfile} />;
}
