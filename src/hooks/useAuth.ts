import type { Session } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type Provider = 'google' | 'github';

interface Auth {
  signIn: (provider?: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  session: Session | null;
}

interface UseAuthOptions {
  protectedRoute?: boolean;
  isAllowed?: (user: Session | null) => boolean;
}

const useAuth = (
  { protectedRoute, isAllowed }: UseAuthOptions = { protectedRoute: false, isAllowed: () => true }
) : Auth => {
  const { data: session, status } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if(protectedRoute && status === 'unauthenticated') {
      handleSignIn().catch(console.error)
    }

    if(protectedRoute && status === 'authenticated' && isAllowed && !isAllowed(session)) {
      void push('/404').catch(console.error)
    }
  }, [protectedRoute, isAllowed, status, session, push]);

  const handleSignIn = async () => {
    await signIn();
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
    }).catch();
  };

  return {
    signIn: handleSignIn,
    signOut: handleSignOut,
    status,
    session,
  };
}

export default useAuth;