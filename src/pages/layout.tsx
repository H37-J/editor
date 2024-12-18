import NavBar from '@/pages/components/layout/NavBar';
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';

const Layout = ({ children }) => {
  const router = useRouter();
  const noLayoutRoutes = ['/login'];
  const shouldUseLayout = !noLayoutRoutes.includes(router.pathname);
  const { session, status } = useAuth();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/login").catch(console.error);
    }
  }, [session && status]);


  return shouldUseLayout ? (
    <div
      className="h-screen py-1.5 px-1.5 ml-16 md:ml-80 space-x-1.5 "
      suppressHydrationWarning={true}
    >
      {session && (
        <>
          <NavBar />
          <div className="flex flex-1 h-full">
            {children}
          </div>
        </>
      )}
    </div>
  ) : (
    <div
      className="h-screen"
      suppressHydrationWarning={true}
    >
      <div className="flex flex-1 h-full">
        {children}
      </div>
    </div>
  );
}

export default Layout;