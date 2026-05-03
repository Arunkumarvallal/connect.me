# Firebase Storage - Pricing Plan Notice

## ⚠️ Important: Storage Requires Paid Plan

Firebase Storage is **not available** on the free Spark plan. To use Firebase Storage features, you need to upgrade to the **Blaze (Pay-as-you-go)** plan.

### How to Upgrade:
1. Visit: https://console.firebase.google.com/project/conntect-3932b/usage
2. Click "Upgrade" or "Modify plan"
3. Select "Blaze Plan"
4. Add billing information

---

## 📋 Features Affected by Missing Storage

Without Firebase Storage (using free Spark plan), the following features will **NOT work**:

### ❌ Features That Require Storage:

1. **Avatar Uploads**
   - Location: `/onboarding` page
   - Feature: ~~Upload profile pictures during onboarding~~ **REMOVED** - now uses Google OAuth profile picture only
   - Fallback: ✅ Using Google/GitHub OAuth profile picture (already implemented)

2. **Tile Image Uploads**
   - Location: Dashboard → Add Image tile → Upload
   - Feature: Upload images to tiles
   - Fallback: Use image URLs only (unsplash, picsum, etc.)

3. **Tile Video Uploads**
   - Location: Dashboard → Add Video tile → Upload
   - Feature: Upload video files
   - Fallback: Use YouTube/Vimeo embeds only

4. **Project File Attachments**
   - Location: Project tiles
   - Feature: Attach files to project tiles
   - Fallback: Use external links only

---

## ✅ Features That Still Work (Without Storage)

### Firestore Database (Free on Spark Plan):
- ✅ User profile data (name, bio, theme)
- ✅ Tile data (text, links, headings)
- ✅ Tile layout positions
- ✅ Theme preferences
- ✅ Username claims

### Authentication (Free on Spark Plan):
- ✅ Google OAuth sign-in
- ✅ GitHub OAuth sign-in
- ✅ Auth state persistence
- ✅ User session management

### Other Features (No Storage Needed):
- ✅ Link previews (uses `/api/link-preview`)
- ✅ Text tiles
- ✅ Social media links
- ✅ Theme switching
- ✅ Drag-and-drop grid
- ✅ Public profile pages

---

## 🔧 Workarounds (While on Free Plan)

### For Images:
1. **Use Image URLs instead of uploads**
   - Unsplash: `https://images.unsplash.com/...`
   - Picsum: `https://picsum.photos/...`
   - Your own hosted images

2. **Use Base64 for small images (temporary)**
   - Already implemented in `control-dock.tsx` and `tile-edit-dialog.tsx`
   - Note: Base64 increases Firestore document size (limit: 1MB per doc)

### For Avatars:
1. **Use OAuth provider avatars**
   - Google: `user.photoURL`
   - GitHub: `user.photoURL`
   - Already handled in auth flow

---

## 💰 Cost Estimation (Blaze Plan)

Firebase Storage pricing (Blaze plan):
- **Storage:** $0.026 per GB / month
- **Downloads:** $0.12 per GB
- **Uploads:** Free

**Example:** If you have 100 users, each with 10MB of images:
- Storage cost: 100 × 10MB = ~$0.03/month
- Very affordable for small-to-medium projects!

---

## 🔍 How to Check Your Plan

1. Visit: https://console.firebase.google.com/project/conntect-3932b/usage
2. Look for "Spark Plan" (free) or "Blaze Plan" (paid)
3. Check if Storage API is enabled

---

## 📝 Summary

| Feature | Works Without Storage? | Fallback Available? |
|---------|----------------------|---------------------|
| User Authentication | ✅ Yes | N/A |
| Profile Data (Firestore) | ✅ Yes | N/A |
| Theme Settings | ✅ Yes | N/A |
| Text Tiles | ✅ Yes | N/A |
| Link Tiles | ✅ Yes | N/A |
| Image Tiles (URL) | ✅ Yes | Use Unsplash/Picsum |
| Image Uploads | ❌ No | Base64 (temporary) |
| Avatar Uploads | ✅ Yes (OAuth only) | Uses Google/GitHub profile pic |
| Video Uploads | ❌ No | Use YouTube embeds |

---

**Decision:** For now, the app works great without Storage! You can:
1. Use image URLs for tiles
2. Use OAuth profile pictures
3. Upgrade to Blaze plan later when you need uploads

Added to: `/docs/firebase-storage-notice.md`
