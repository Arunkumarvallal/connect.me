
import { UserProfile } from "@/types/profile";

/**
 * Phase 1 seed data — used as the initial profile in the Zustand store and
 * as the demo profile on the public `/juarezfilho` route.
 *
 * Phase 2: remove this file and replace all usages with Firestore lookups
 * keyed by Firebase Auth UID / username.
 */
const DEMO_AVATAR = "https://picsum.photos/seed/juarez/400/400";

export const mockProfile: UserProfile = {
  username: "juarezfilho",
  displayName: "Juarez Filho",
  avatarUrl: DEMO_AVATAR,
  bio: "Experience Designer bringing technical know-how and design finesse. Conquering complex business hurdles with user-focused solutions. Living in Dublin 🇮🇪",
  location: "Dublin, Ireland",
  theme: {
    mode: 'light',
    font: 'headline',
    background: 'white'
  },
  tiles: [
    {
      id: "mentor-1",
      type: "image",
      size: "2x2",
      layout: { x: 0, y: 0, w: 2, h: 2 },
      title: "Get mentored by Juarez Filho on ADPList",
      content: "adplist.org",
      metadata: {
        imageUrl: "https://picsum.photos/seed/mentoring/600/350",
        linkText: "adplist.org"
      }
    },
    {
      id: "project-1",
      type: "project",
      size: "2x2",
      layout: { x: 2, y: 0, w: 2, h: 2 },
      title: "Figma",
      metadata: {
        username: "@juarez",
        buttonText: "Follow 215",
        previews: [
          "https://picsum.photos/seed/p1/200/200",
          "https://picsum.photos/seed/p2/200/200",
          "https://picsum.photos/seed/p3/200/200",
          "https://picsum.photos/seed/p4/200/200"
        ]
      }
    },
    {
      id: "li-1",
      type: "social",
      size: "1x1",
      layout: { x: 0, y: 2, w: 1, h: 1 },
      title: "Connect with me via LinkedIn",
      metadata: { brand: "LinkedIn", linkText: "linkedin.com" }
    },
    {
      id: "tw-1",
      type: "social",
      size: "1x1",
      layout: { x: 1, y: 2, w: 1, h: 1 },
      title: "Twitter",
      metadata: { brand: "Twitter", username: "@juarezpaf", buttonText: "Follow 3.0K" }
    },
    {
      id: "map-1",
      type: "map",
      size: "2x1",
      layout: { x: 2, y: 2, w: 2, h: 1 },
      title: "Blackrock, County Dublin, Ireland",
      metadata: { location: "Blackrock", imageUrl: "https://picsum.photos/seed/map/600/300" }
    },
    {
      id: "help-text",
      type: "text",
      size: "2x1",
      layout: { x: 0, y: 3, w: 2, h: 1 },
      title: "How can I help? ⚡️",
      content: "If you're looking to take your skills to the next level or need guidance in your career, let's work together",
      metadata: { accentColor: "#000000" }
    },
    {
      id: "email-1",
      type: "email",
      size: "2x1",
      layout: { x: 2, y: 3, w: 2, h: 1 },
      content: "juarezpaf@gmail.com"
    }
  ]
};
