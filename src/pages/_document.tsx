import { Html, Head, Main, NextScript } from 'next/document';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';

const Document = () => {

  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-dark-1 ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;