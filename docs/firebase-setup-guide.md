# Quick Start Guide - Firebase Setup

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `connect-me` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Google** provider:
   - Click on Google
   - Enable the toggle
   - Select a support email
   - Save
5. Enable **GitHub** provider:
   - Click on GitHub
   - Enable the toggle
   - You'll need to create a GitHub OAuth App (see step 3)

## 3. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Connect.me
   - **Homepage URL**: http://localhost:9002
   - **Authorization callback URL**: Copy from Firebase GitHub provider settings
4. Click "Register application"
5. Generate a **Client secret**
6. Copy **Client ID** and **Client Secret** to Firebase GitHub provider settings

## 4. Create Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click "Create database"
3. Select "Start in **production mode**"
4. Choose a location closest to your users
5. Click "Enable"

## 5. Enable Firebase Storage

1. In Firebase Console, go to **Build → Storage**
2. Click "Get started"
3. Select "Start in **production mode**"
4. Choose the same location as Firestore
5. Click "Done"

## 6. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Register app with nickname: `connect-me-web`
5. Copy the `firebaseConfig` object values

## 7. Set Up Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase config values in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=connect-me-xxxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=connect-me-xxxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=connect-me-xxxx.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
   ```

## 8. Install Dependencies

```bash
npm install
```

## 9. Run the Development Server

```bash
npm run dev
```

The app will be available at http://localhost:9002

## 10. Test the Flow

1. **Visit** http://localhost:9002
2. **Click** "Get Started" or "Login"
3. **Sign in** with Google or GitHub
4. **New users** will be redirected to `/onboarding`:
   - Choose a username (check uniqueness)
   - Upload an avatar (optional)
   - Add a bio (max 150 chars)
   - Click "Complete Setup"
5. **Existing users** will be redirected to `/dashboard`
6. **Test the dashboard**:
   - Add tiles using the bottom dock
   - Drag and resize tiles
   - Edit tile content
   - Change theme in settings
   - Upload images (should go to Firebase Storage)
7. **View public profile**:
   - Click "Share" in the dock
   - Visit your public profile URL

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check that your `.env.local` values are correct
- Restart the dev server after changing env vars

### "Firebase: Error (auth/unauthorized-domain)"
- Add `localhost` to Firebase Console → Authentication → Settings → Authorized domains

### "Firestore: Permission denied"
- Check your Firestore security rules
- For testing, you can use these open rules (NOT for production!):
  ```javascript
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```

### Image uploads fail
- Check Firebase Storage rules
- For testing, use open rules (NOT for production!):
  ```javascript
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read, write: if true;
      }
    }
  }
  ```

## Next Steps

1. Set up proper Firestore security rules for production
2. Set up proper Storage security rules for production
3. Deploy to hosting: `npm run build && firebase deploy`
4. Set up GitHub Actions for CI/CD

---

**Need help?** Check the [Firebase Documentation](https://firebase.google.com/docs) or the [Next.js Documentation](https://nextjs.org/docs).
