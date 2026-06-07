
import { UserProfile } from "@/types/profile";
import { DEFAULT_HERO_ACCENT } from "@/types/profile";

/**
 * Phase 1+ revamp seed data — a developer portfolio (shamthedev).
 * Used as the initial profile in the Zustand store and demo profile.
 *
 * Tiles are split across the chennai-react sections: socials, projects,
 * experience, sponsors (community), contact.
 */

const DEMO_AVATAR = "https://picsum.photos/seed/shamthedev/400/400";

export const mockProfile: UserProfile = {
  username: "sarahchen_id", // keep username stable for routing
  displayName: "Sham S.",
  avatarUrl: DEMO_AVATAR,
  bio: "Full-stack engineer building developer tools and open-source UI kits. Currently shipping bento grids, edge functions, and a tiny LLM playground.",
  location: "Bengaluru, IN",
  theme: {
    font: 'sans',
    background: 'white',
    heroAccent: { ...DEFAULT_HERO_ACCENT, kind: 'oss', label: 'Open source', emoji: '✦' },
    maxCols: 4,
  },
  socialLinks: {
    github:    'https://github.com/shamthedev',
    linkedin:  'https://linkedin.com/in/shamthedev',
    twitter:   'https://x.com/shamthedev',
    portfolio: 'https://shamthedev.dev',
    email:     'hello@shamthedev.dev',
  },
  tiles: [
    // Socials section
    {
      id: "s-github",
      type: "social",
      size: "1x1",
      layout: { x: 0, y: 0, w: 1, h: 1 },
      title: "GitHub",
      metadata: {
        brand: "GitHub",
        handle: "@shamthedev",
        buttonText: "1.2k ★",
        section: "socials",
        cardVariant: "brand",
      },
    },
    {
      id: "s-linkedin",
      type: "social",
      size: "1x1",
      layout: { x: 1, y: 0, w: 1, h: 1 },
      title: "LinkedIn",
      metadata: {
        brand: "LinkedIn",
        handle: "in/shamthedev",
        buttonText: "Connect",
        section: "socials",
        cardVariant: "brand",
      },
    },
    {
      id: "s-twitter",
      type: "social",
      size: "1x1",
      layout: { x: 2, y: 0, w: 1, h: 1 },
      title: "X / Twitter",
      metadata: {
        brand: "Twitter",
        handle: "@shamthedev",
        buttonText: "Follow",
        section: "socials",
        cardVariant: "brand",
      },
    },
    {
      id: "s-youtube",
      type: "social",
      size: "1x1",
      layout: { x: 0, y: 1, w: 1, h: 1 },
      title: "YouTube",
      metadata: {
        brand: "YouTube",
        handle: "@shamthedev",
        buttonText: "Subscribe",
        section: "socials",
        cardVariant: "brand",
      },
    },
    {
      id: "s-discord",
      type: "social",
      size: "1x1",
      layout: { x: 1, y: 1, w: 1, h: 1 },
      title: "Discord",
      metadata: {
        brand: "Discord",
        handle: "shamthedev#0001",
        section: "socials",
        cardVariant: "brand",
      },
    },
    {
      id: "s-portfolio",
      type: "social",
      size: "1x1",
      layout: { x: 2, y: 1, w: 1, h: 1 },
      title: "Portfolio",
      metadata: {
        brand: "Portfolio",
        handle: "shamthedev.dev",
        section: "socials",
        cardVariant: "brand",
      },
    },

    // Projects section
    {
      id: "heading-projects",
      type: "heading",
      size: "3x1",
      layout: { x: 0, y: 2, w: 3, h: 1 },
      title: "Open-source projects",
      metadata: { section: "projects" },
    },
    {
      id: "p-bento",
      type: "project",
      size: "2x2",
      layout: { x: 0, y: 3, w: 2, h: 2 },
      title: "bento-grid",
      url: "https://github.com/shamthedev/bento-grid",
      metadata: {
        description: "Zero-dependency React bento grid primitive. Drag, resize, persist.",
        label: "React,Tailwind,OSS",
        accentChip: "OSS",
        previews: [
          "https://picsum.photos/seed/bento1/300/200",
          "https://picsum.photos/seed/bento2/300/200",
        ],
        section: "projects",
        cardVariant: "image",
        imageUrl: "https://picsum.photos/seed/bento-hero/600/400",
      },
    },
    {
      id: "p-edgekit",
      type: "project",
      size: "1x1",
      layout: { x: 2, y: 3, w: 1, h: 1 },
      title: "edgekit",
      url: "https://github.com/shamthedev/edgekit",
      metadata: {
        description: "Type-safe edge function toolkit.",
        label: "TypeScript,Edge",
        accentChip: "OSS",
        section: "projects",
        cardVariant: "gradient",
      },
    },
    {
      id: "p-llmplay",
      type: "project",
      size: "1x1",
      layout: { x: 2, y: 4, w: 1, h: 1 },
      title: "llmplay",
      url: "https://github.com/shamthedev/llmplay",
      metadata: {
        description: "Tiny local LLM playground.",
        label: "Python,LLM",
        accentChip: "OSS",
        section: "projects",
        cardVariant: "gradient",
      },
    },
    {
      id: "p-textkit",
      type: "project",
      size: "1x1",
      layout: { x: 0, y: 5, w: 1, h: 1 },
      title: "textkit",
      url: "https://github.com/shamthedev/textkit",
      metadata: {
        description: "String utilities for fast text pipelines.",
        label: "Go,CLI",
        accentChip: "OSS",
        section: "projects",
        cardVariant: "plain",
      },
    },
    {
      id: "p-site",
      type: "link",
      size: "2x1",
      layout: { x: 1, y: 5, w: 2, h: 1 },
      title: "shamthedev.dev",
      content: "https://shamthedev.dev",
      url: "https://shamthedev.dev",
      metadata: { section: "projects" },
    },

    // Experience section
    {
      id: "heading-experience",
      type: "heading",
      size: "3x1",
      layout: { x: 0, y: 6, w: 3, h: 1 },
      title: "Where I've worked",
      metadata: { section: "experience" },
    },
    {
      id: "e-text",
      type: "text",
      size: "2x1",
      layout: { x: 0, y: 7, w: 2, h: 1 },
      title: "Senior Engineer @ Acme Cloud",
      content: "Edge runtime, developer platform, open-source DX.",
      metadata: { section: "experience" },
    },
    {
      id: "e-text-2",
      type: "text",
      size: "1x1",
      layout: { x: 2, y: 7, w: 1, h: 1 },
      title: "Open-source maintainer",
      content: "bento-grid, edgekit, llmplay",
      metadata: { section: "experience" },
    },
    {
      id: "e-image",
      type: "image",
      size: "3x1",
      layout: { x: 0, y: 8, w: 3, h: 1 },
      title: "Speaking at React Conf 2025",
      metadata: {
        imageUrl: "https://picsum.photos/seed/speaking/800/300",
        section: "experience",
        cardVariant: "image",
      },
    },

    // Sponsors / community section
    {
      id: "heading-sponsors",
      type: "heading",
      size: "3x1",
      layout: { x: 0, y: 9, w: 3, h: 1 },
      title: "Community & sponsors",
      metadata: { section: "sponsors" },
    },
    {
      id: "sp-1",
      type: "image",
      size: "1x1",
      layout: { x: 0, y: 10, w: 1, h: 1 },
      title: "Acme Cloud",
      url: "https://acme.cloud",
      metadata: {
        imageUrl: "https://picsum.photos/seed/sponsor1/200/200",
        section: "sponsors",
        cardVariant: "image",
      },
    },
    {
      id: "sp-2",
      type: "image",
      size: "1x1",
      layout: { x: 1, y: 10, w: 1, h: 1 },
      title: "Vercel",
      url: "https://vercel.com",
      metadata: {
        imageUrl: "https://picsum.photos/seed/sponsor2/200/200",
        section: "sponsors",
        cardVariant: "image",
      },
    },
    {
      id: "sp-3",
      type: "image",
      size: "1x1",
      layout: { x: 2, y: 10, w: 1, h: 1 },
      title: "GitHub",
      url: "https://github.com/sponsors",
      metadata: {
        imageUrl: "https://picsum.photos/seed/sponsor3/200/200",
        section: "sponsors",
        cardVariant: "image",
      },
    },

    // Contact section
    {
      id: "heading-contact",
      type: "heading",
      size: "3x1",
      layout: { x: 0, y: 11, w: 3, h: 1 },
      title: "Get in touch",
      metadata: { section: "contact" },
    },
    {
      id: "c-email",
      type: "email",
      size: "2x1",
      layout: { x: 0, y: 12, w: 2, h: 1 },
      content: "hello@shamthedev.dev",
      metadata: { section: "contact" },
    },
    {
      id: "c-map",
      type: "map",
      size: "1x1",
      layout: { x: 2, y: 12, w: 1, h: 1 },
      title: "Bengaluru, IN",
      metadata: { location: "Bengaluru", imageUrl: "https://picsum.photos/seed/blr/300/200", section: "contact" },
    },
  ],
};
