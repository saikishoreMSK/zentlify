// src/app/components/AuthSessionProvider.jsx
'use client';

// Attempting to re-resolve the import path for SessionProvider
import { SessionProvider } from 'next-auth/react';

/**
 * The SessionProvider component must be a client component (as indicated by 'use client').
 * It uses React Context to make the session data available to all client components 
 * wrapped within it, via the useSession() hook.
 */
export default function AuthSessionProvider({ children }) {
  // We wrap the children with the SessionProvider to inject authentication context.
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}