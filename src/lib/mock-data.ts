
import { UserProfile } from "@/types/profile";
import { PlaceHolderImages } from "./placeholder-images";

const avatar = PlaceHolderImages.find(img => img.id === 'profile-avatar')?.imageUrl;
const work = PlaceHolderImages.find(img => img.id === 'tile-image-1')?.imageUrl;
const art = PlaceHolderImages.find(img => img.id === 'tile-image-2')?.imageUrl;

export const mockProfile: UserProfile = {
  username: "chennaireact",
  displayName: "CHENNAI REACT",
  avatarUrl: avatar || "https://picsum.photos/seed/chennai/400/400",
  bio: "We are a community of enthusiasts who are passionate about all things React. This community provides a platform to meetup, connect, and deepen our knowledge on the latest trends and developments in Reactjs.",
  theme: {
    mode: 'light',
    font: 'headline',
    background: 'white'
  },
  tiles: [
    {
      id: "li-1",
      type: "social",
      size: "2x1",
      metadata: { brand: "LinkedIn" }
    },
    {
      id: "luma-1",
      type: "luma",
      size: "1x1"
    },
    {
      id: "wa-1",
      type: "whatsapp",
      size: "1x1"
    },
    {
      id: "insta-1",
      type: "instagram",
      size: "1x1"
    },
    {
      id: "discord-1",
      type: "discord",
      size: "2x1"
    },
    {
      id: "tw-1",
      type: "social",
      size: "1x1",
      metadata: { brand: "Twitter" }
    },
    {
      id: "gh-1",
      type: "github",
      size: "1x1",
      metadata: { username: "chennaireact" }
    },
    {
      id: "yt-1",
      type: "youtube",
      size: "1x1"
    },
    {
      id: "banner-1",
      type: "image",
      size: "3x1",
      title: "CALL FOR SPEAKERS",
      metadata: { imageUrl: work }
    },
    {
      id: "banner-2",
      type: "image",
      size: "3x1",
      title: "CALL FOR SPONSORS",
      content: "Email us: chennaireactjs@gmail.com",
      metadata: { imageUrl: art }
    }
  ]
};
