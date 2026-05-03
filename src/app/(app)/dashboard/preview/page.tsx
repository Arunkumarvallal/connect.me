'use client';

import { useProfileStore } from '@/store/profile-store';
import { PublicProfile } from '@/components/profile/public-profile';

export default function PreviewPage() {
  const profile = useProfileStore((s) => s.profile);
  
  return (
    <div className="min-h-screen bg-background">
      <PublicProfile profile={profile} previewMode={true} />
    </div>
  );
}
