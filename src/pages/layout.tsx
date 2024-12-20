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
      className="h-screen md:p-1.5 md:ml-72 md:space-x-1.5"
      suppressHydrationWarning={true}
    >
      {session && (
        <>
          <NavBar />
            {children}
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