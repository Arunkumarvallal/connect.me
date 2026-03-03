import { notFound } from 'next/navigation';
import { mockProfile } from '@/lib/mock-data';
import { PublicProfile } from '@/components/profile/public-profile';

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Phase 2: replace with Firestore lookup by username.
  // For now, only the demo username resolves to a profile; everything else is a 404.
  if (username !== mockProfile.username) {
    notFound();
  }

  return <PublicProfile profile={mockProfile} />;
}
