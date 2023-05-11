import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps<{}>) {
  const queryClient = new QueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkPassword() {
      
      const password = prompt('Please enter the password:');
      
      if (password) {
        const response = await fetch('/api/password-check', {
          method: 'POST',
          body: JSON.stringify({ password }),
          headers: { 'Content-Type': 'application/json' },
        });
      
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          await checkPassword();
        }
      } else {
        await checkPassword();
      }
          }

    checkPassword();
  }, []);

  return isAuthenticated ? (
    <div className={inter.className}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  ) : null;
}

export default appWithTranslation(App);
