import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadProgress {
  progress: number;
  url?: string;
  error?: string;
}

/**
 * Upload an image to Firebase Storage
 * @param file - The file to upload
 * @param path - Storage path (e.g., 'avatars/{userId}/{filename}')
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Promise with download URL
 */
export async function uploadImage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

/**
 * Delete a file from Firebase Storage
 * @param path - Storage path to delete
 */
export async function deleteImage(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  try {
    await deleteObject(storageRef);
  } catch (error: any) {
    // File doesn't exist or already deleted
    if (error.code !== 'storage/object-not-found') {
      console.error('Delete error:', error);
      throw error;
    }
  }
}

/**
 * Generate a storage path for avatar images
 */
export function getAvatarPath(userId: string, filename: string): string {
  const ext = filename.split('.').pop();
  return `avatars/${userId}/avatar.${ext}`;
}

/**
 * Generate a storage path for tile images
 */
export function getTileImagePath(userId: string, tileId: string, filename: string): string {
  const ext = filename.split('.').pop();
  return `tiles/${userId}/${tileId}/image.${ext}`;
}

/**
 * Generate a storage path for tile videos
 */
export function getTileVideoPath(userId: string, tileId: string, filename: string): string {
  const ext = filename.split('.').pop();
  return `tiles/${userId}/${tileId}/video.${ext}`;
}
