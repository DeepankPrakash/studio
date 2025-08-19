# Firebase Authentication Setup

This project now includes Firebase Authentication with email/password login. Follow these steps to complete the setup:

## Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password** authentication
5. Go to **Project Settings** (gear icon) > **General** tab
6. In the "Your apps" section, add a web app if you haven't already
7. Copy the Firebase configuration values

## Environment Variables Setup

1. Open the `.env.local` file in your project root
2. Fill in your Firebase configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
```

## Features Included

- ✅ Email/Password authentication
- ✅ User registration and login
- ✅ Protected routes
- ✅ Auth state management with React Context
- ✅ User menu with profile and logout
- ✅ Responsive authentication forms
- ✅ Form validation and error handling
- ✅ Loading states and user feedback

## How to Use

### Protecting Routes
Wrap any component that requires authentication with `ProtectedRoute`:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  );
}
```

### Using Auth Context
Access current user and auth state:

```tsx
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Auth Functions
Import and use authentication functions:

```tsx
import { signIn, signUp, signOutUser } from '@/lib/auth';

// Sign in
await signIn(email, password);

// Sign up
await signUp(email, password, displayName);

// Sign out
await signOutUser();
```

## Pages

- `/login` - Authentication page with sign in/sign up tabs
- `/app/generate` - Protected route (requires authentication)
- `/app/chat` - Protected route (requires authentication)

## Development

1. Start the development server:
```bash
npm run dev
```

2. Visit `http://localhost:3000/login` to test authentication
3. Create an account or sign in with existing credentials
4. You'll be redirected to protected pages after successful authentication

## Security Notes

- All Firebase config values are safe to expose in client-side code (they're public by design)
- Firebase Security Rules on the server-side control actual data access
- Consider adding email verification for production apps
- You can add additional providers (Google, GitHub, etc.) in the Firebase console
