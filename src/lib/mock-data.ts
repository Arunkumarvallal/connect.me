
import { UserProfile } from "@/types/profile";

/**
 * Phase 1 seed data — Instructional Designer with 5 years experience
 * Used as the initial profile in the Zustand store and demo profile
 */

const DEMO_AVATAR = "https://picsum.photos/seed/sarahchen/400/400";

export const mockProfile: UserProfile = {
  username: "sarahchen_id",
  displayName: "Sarah Chen",
  avatarUrl: DEMO_AVATAR,
  bio: "Instructional Designer with 5+ years crafting learner-centric training for tech, healthcare, and higher ed. Specializing in eLearning, microlearning, and competency-based assessment.",
  location: "San Francisco, CA",
  theme: {
    font: 'sans',
    background: 'white'
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/in/sarahchen-id',
    portfolio: 'https://sarahchen-design.com',
    email: 'sarah@sarahchen-design.com'
  },
  tiles: [
    // Profile tile (full-width hero)
    {
      id: "profile-1",
      type: "profile",
      size: "3x2",
      layout: { x: 0, y: 0, w: 3, h: 2 },
    },
    // Heading: Experience summary
    {
      id: "heading-exp",
      type: "heading",
      size: "3x1",
      layout: { x: 0, y: 2, w: 3, h: 1 },
      title: "5 Years of Learning Impact"
    },
    // Text: Experience details
    {
      id: "text-exp",
      type: "text",
      size: "2x1",
      layout: { x: 0, y: 3, w: 2, h: 1 },
      title: "My Journey",
      content: "• 5+ years in Instructional Design\n• Industries: Tech, Healthcare, Higher Ed\n• Specialties: eLearning, Microlearning, Competency Assessment\n• Tools: Articulate 360, Captivate, Figma, Storyline"
    },
    // Link: Portfolio
    {
      id: "link-portfolio",
      type: "link",
      size: "1x1",
      layout: { x: 2, y: 3, w: 1, h: 1 },
      title: "View My Portfolio",
      content: "https://sarahchen-design.com",
      metadata: { linkText: "sarahchen-design.com" }
    },
    // Social: LinkedIn
    {
      id: "li-1",
      type: "social",
      size: "1x1",
      layout: { x: 3, y: 3, w: 1, h: 1 },
      title: "Connect on LinkedIn",
      metadata: { brand: "LinkedIn", linkText: "linkedin.com/in/sarahchen" }
    },
    // Image: Healthcare project
    {
      id: "img-hc",
      type: "image",
      size: "2x2",
      layout: { x: 0, y: 4, w: 2, h: 2 },
      title: "Healthcare Compliance Training",
      metadata: {
        imageUrl: "https://picsum.photos/seed/healthcare/600/400",
        linkText: "View Project"
      }
    },
    // Image: eLearning module
    {
      id: "img-elearn",
      type: "image",
      size: "2x2",
      layout: { x: 2, y: 4, w: 2, h: 2 },
      title: "Software Onboarding Module",
      metadata: {
        imageUrl: "https://picsum.photos/seed/elearning/600/400",
        linkText: "View Demo"
      }
    },
    // Text: Tools & Skills
    {
      id: "text-tools",
      type: "text",
      size: "3x1",
      layout: { x: 0, y: 6, w: 3, h: 1 },
      title: "Tools I Master",
      content: "Articulate 360 • Adobe Captivate • Figma • Canva • LMS (Canvas, Blackboard) • HTML/CSS • Camtasia"
    },
    // Social: Twitter
    {
      id: "tw-1",
      type: "social",
      size: "1x1",
      layout: { x: 0, y: 7, w: 1, h: 1 },
      title: "Follow on Twitter",
      metadata: { brand: "Twitter", username: "@sarahchen_id", buttonText: "Follow 1.2K" }
    },
    // Social: Behance
    {
      id: "be-1",
      type: "social",
      size: "1x1",
      layout: { x: 1, y: 7, w: 1, h: 1 },
      title: "Design Portfolio",
      metadata: { brand: "Behance", linkText: "behance.net/sarahchen" }
    },
    // Video: Course demo
    {
      id: "video-demo",
      type: "video",
      size: "2x2",
      layout: { x: 2, y: 7, w: 2, h: 2 },
      title: "Course Demo: Data Privacy Training",
      content: "https://youtube.com/watch?v=dQw4w9WgXcQ", // placeholder
      metadata: { videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ" }
    },
    // Email contact
    {
      id: "email-1",
      type: "email",
      size: "2x1",
      layout: { x: 0, y: 9, w: 2, h: 1 },
      content: "sarah.chen@idpro.com"
    },
    // Map location
    {
      id: "map-1",
      type: "map",
      size: "2x1",
      layout: { x: 2, y: 9, w: 2, h: 1 },
      title: "San Francisco, CA",
      metadata: { location: "San Francisco", imageUrl: "https://picsum.photos/seed/sfmap/600/300" }
    }
  ]
};
