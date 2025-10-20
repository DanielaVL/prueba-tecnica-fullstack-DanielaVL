import { type Session } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn: () => signIn('github'),
    signOut,
  };
}
