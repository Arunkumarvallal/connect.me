'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProfileStore } from '@/store/profile-store';
import { LinkPreview, Tile } from '@/types/profile';
import { uploadImage, getTileImagePath } from '@/lib/storage';
import { auth } from '@/lib/firebase';

export function TileEditDialog() {
  const { editingTile, setEditingTile, updateTile } = useProfileStore();
  const [form, setForm] = useState<Tile | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    setForm(editingTile ? { ...editingTile } : null);
  }, [editingTile]);

  if (!form) return null;

  function patch(patch: Partial<Tile>) {
    setForm((prev) => (prev ? { ...prev, ...patch } : null));
  }

  function patchMeta(meta: Partial<NonNullable<Tile['metadata']>>) {
    setForm((prev) =>
      prev ? { ...prev, metadata: { ...prev.metadata, ...meta } } : null
    );
  }

  async function fetchLinkPreview(url: string) {
    if (!url) return;
    setLoadingPreview(true);
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error('Failed');
      const data: LinkPreview = await res.json();
      patchMeta({ linkPreview: data });
      if (!form?.title && data.title) patch({ title: data.title });
    } catch {
      toast.error('Could not fetch link preview.');
    } finally {
      setLoadingPreview(false);
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Use base64 for free plan (Storage not available)
    if (file.size > 500 * 1024) { // 500KB limit for base64
      toast.error('File too large. Upgrade to Blaze plan for Firebase Storage.');
      return;
    }

    // Show loading state via toast
    toast.loading('Converting image...');
    
    // Convert to base64 (temporary solution for free plan)
    const reader = new FileReader();
    reader.onload = () => {
      patchMeta({ 
        imageData: reader.result as string,
      });
      toast.dismiss();
      toast.success('Image added as base64');
      toast.info('Image added as base64. Upgrade to Blaze plan for Firebase Storage.', { duration: 5000 });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    
    // TODO: Uncomment below when you upgrade to Blaze plan
    /*
    const userId = auth.currentUser?.uid;
    if (!userId) {
      toast.error('You must be signed in to upload images');
      patchMeta({ uploading: false });
      return;
    }

    // TODO: Uncomment when you upgrade to Blaze plan
    /*
    const path = getTileImagePath(userId, form.id, file.name);
    uploadImage(file, path)
      .then((downloadURL) => {
        patchMeta({ 
          imageUrl: downloadURL, 
          imageStoragePath: path,
        });
        toast.success('Image uploaded successfully!');
      })
      .catch((error) => {
        console.error('Upload failed:', error);
        toast.error('Failed to upload image');
      });
    */
  }

  function handleSave() {
    if (!form) return;
    updateTile(form);
    toast.success('Tile updated');
  }

  return (
    <Dialog open={!!editingTile} onOpenChange={(open) => !open && setEditingTile(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">Edit {form.type} tile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="tile-title">Title</Label>
            <Input
              id="tile-title"
              value={form.title ?? ''}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Tile title"
            />
          </div>

          {/* Content / note */}
          {(form.type === 'text' || form.type === 'heading') && (
            <div className="space-y-1">
              <Label htmlFor="tile-content">Content</Label>
              <Textarea
                id="tile-content"
                value={form.content ?? ''}
                rows={3}
                onChange={(e) => patch({ content: e.target.value })}
              />
            </div>
          )}

          {/* URL with link preview */}
          {(form.type === 'link' || form.type === 'social' || form.type === 'image') && (
            <div className="space-y-1">
              <Label htmlFor="tile-url">URL</Label>
              <div className="flex gap-2">
                <Input
                  id="tile-url"
                  value={form.url ?? ''}
                  onChange={(e) => patch({ url: e.target.value })}
                  placeholder="https://example.com"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!form.url || loadingPreview}
                  onClick={() => fetchLinkPreview(form.url!)}
                >
                  {loadingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Preview'}
                </Button>
              </div>
              {form.metadata?.linkPreview && (
                <div className="flex items-center gap-2 p-2 rounded-md border border-border bg-muted text-sm mt-1">
                  {form.metadata.linkPreview.favicon && (
                    <Image
                      src={form.metadata.linkPreview.favicon}
                      width={16}
                      height={16}
                      alt=""
                      unoptimized
                    />
                  )}
                  <span className="truncate">{form.metadata.linkPreview.title}</span>
                </div>
              )}
            </div>
          )}

          {/* Image upload */}
          {(form.type === 'image' || form.type === 'project') && (
            <div className="space-y-1">
              <Label htmlFor="tile-img">Upload Image</Label>
              <Input
                id="tile-img"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {(form.metadata?.imageData || form.metadata?.imageUrl) && (
                <div className="relative w-full h-28 mt-1 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={(form.metadata.imageData ?? form.metadata.imageUrl)!}
                    alt="preview"
                    fill
                    className="object-cover"
                    unoptimized={!!form.metadata.imageData}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setEditingTile(null)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
