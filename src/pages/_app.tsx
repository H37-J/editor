import '@/styles/globals.css';
import '@/styles/editor.css';
import '@/styles/modal.css';
import '@/styles/FlashMessage.css';
import '@/styles/ExcalidrawModal.css';
import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import Layout from './layout';
import { FlassMessageContext } from '@/context/FleshMessageContext';
import api from '@/utils/api';
const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps},
}) => {
  return (
    <SessionProvider session={session}>
      <FlassMessageContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </FlassMessageContext>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
