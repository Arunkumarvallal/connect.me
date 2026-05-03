'use client';

import { useState } from 'react';
import { useProfileStore } from '@/store/profile-store';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { UserProfile, SocialLinks } from '@/types/profile';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

import { 
  User, 
  Share2, 
  LogOut, 
  Save,
  ArrowLeft,
  Upload,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { profile, updateProfile, setCustomCols, customCols } = useProfileStore();
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    setSaving(true);
    try {
      updateProfile(updates);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSocialUpdate = (socialUpdates: Partial<SocialLinks>) => {
    updateProfile({
      socialLinks: { ...profile.socialLinks, ...socialUpdates }
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  const userDisplayName = user?.displayName || profile.displayName;
  const userPhotoURL = user?.photoURL || profile.avatarUrl;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="social">
              <Share2 className="w-4 h-4 mr-2" />
              Social Links
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and how others see you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userPhotoURL} alt={userDisplayName} />
                    <AvatarFallback className="text-2xl font-semibold">
                      {userDisplayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Change Avatar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => handleProfileUpdate({ username: e.target.value })}
                    placeholder="your-username"
                  />
                  <p className="text-sm text-muted-foreground">
                    This is your public display name. It will be used in your profile URL.
                  </p>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => handleProfileUpdate({ displayName: e.target.value })}
                    placeholder="Your Name"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleProfileUpdate({ bio: e.target.value })}
                    placeholder="Tell people about yourself..."
                    rows={3}
                    maxLength={150}
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {profile.bio.length}/150
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location || ''}
                    onChange={(e) => handleProfileUpdate({ location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                <Button onClick={() => handleProfileUpdate({})} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Social Links Settings */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Add your social media and portfolio links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={profile.socialLinks?.linkedin || ''}
                      onChange={(e) => handleSocialUpdate({ linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter / X</Label>
                    <Input
                      id="twitter"
                      value={profile.socialLinks?.twitter || ''}
                      onChange={(e) => handleSocialUpdate({ twitter: e.target.value })}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={profile.socialLinks?.github || ''}
                      onChange={(e) => handleSocialUpdate({ github: e.target.value })}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio</Label>
                    <Input
                      id="portfolio"
                      value={profile.socialLinks?.portfolio || ''}
                      onChange={(e) => handleSocialUpdate({ portfolio: e.target.value })}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Public Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.socialLinks?.email || ''}
                      onChange={(e) => handleSocialUpdate({ email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <Button onClick={() => handleSocialUpdate({})} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Links'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
