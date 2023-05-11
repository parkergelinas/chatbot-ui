import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import { useEffect, useState } from "react";

import '@/styles/globals.css';

import PasswordModal from '@/components/PasswordModal'; // Update with your correct path

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps<{}>) {
  const queryClient = new QueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const checkPassword = async (password: string) => {
    const response = await fetch("/api/password-check", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      setPassword(''); // Reset the password to trigger the PasswordModal
    }
  }

  useEffect(() => {
    if (password) {
      checkPassword(password);
    }
  }, [password]);

  return isAuthenticated ? (
    <div className={inter.className}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  ) : (
    <PasswordModal onSubmit={setPassword} />
  );
}

export default appWithTranslation(App);
