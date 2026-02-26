
import { UserProfile } from "@/types/profile";
import { PlaceHolderImages } from "./placeholder-images";

const avatar = PlaceHolderImages.find(img => img.id === 'profile-avatar')?.imageUrl;
const work = PlaceHolderImages.find(img => img.id === 'tile-image-1')?.imageUrl;
const art = PlaceHolderImages.find(img => img.id === 'tile-image-2')?.imageUrl;
const album = PlaceHolderImages.find(img => img.id === 'spotify-album')?.imageUrl;

export const mockProfile: UserProfile = {
  username: "johndoe",
  displayName: "John Doe",
  avatarUrl: avatar || "https://picsum.photos/seed/1/400/400",
  bio: "Product Designer & Frontend Developer. Building tools for the modern web.",
  theme: {
    mode: 'light',
    font: 'headline',
    background: 'mesh'
  },
  tiles: [
    {
      id: "bio-1",
      type: "bio",
      size: "2x1",
    },
    {
      id: "x-1",
      type: "social",
      size: "1x1",
      url: "https://x.com/johndoe",
      metadata: { brand: "X", username: "@johndoe" }
    },
    {
      id: "spotify-1",
      type: "spotify",
      size: "2x2",
      metadata: { imageUrl: album, description: "Currently Playing", title: "Midnight City - M83" }
    },
    {
      id: "img-1",
      type: "image",
      size: "1x2",
      metadata: { imageUrl: work }
    },
    {
      id: "gh-1",
      type: "github",
      size: "2x1",
      url: "https://github.com/johndoe",
      metadata: { username: "johndoe", description: "Open Source Contributions" }
    },
    {
      id: "linkedin-1",
      type: "social",
      size: "1x1",
      url: "https://linkedin.com/in/johndoe",
      metadata: { brand: "LinkedIn" }
    },
    {
      id: "art-1",
      type: "image",
      size: "1x1",
      metadata: { imageUrl: art }
    },
    {
      id: "yt-1",
      type: "youtube",
      size: "2x1",
      metadata: { username: "John's Lab", description: "Design Tutorials" }
    }
  ]
};
