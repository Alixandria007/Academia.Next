'use client';

import { useEffect, useState } from 'react';
import Login from '../Login';
import { Header } from '../Header';
import Footer from '../Footer';

export const revalidate = 10;

export default function AuthComponent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAutheticated, setIsAuthenticated] = useState<boolean>(true)

  useEffect(() => {
    const verifyTokens = async () => {
      const refreshAccessToken = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
          } else {
            console.warn('Erro ao atualizar o token, redirecionando para login.');
            setIsAuthenticated(false)
          }
        } catch (error) {
          console.error('Erro ao tentar atualizar o token:', error);
          setIsAuthenticated(false)
        }
      };

      const checkAccessToken = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/token/verify/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
          },
            credentials: 'include',
          });

          if (!response.ok) {
            console.warn('Token inválido, tentando atualizar...');
            await refreshAccessToken();
          }
        } catch (error) {
          console.error('Erro ao verificar o token:', error);
          setIsAuthenticated(false)
          }
      };

      await checkAccessToken();
      setIsLoading(false);
    };

    verifyTokens();
  }, []);

  if (isLoading) return null;

  if (!isAutheticated) return <><Login onLoginSuccess={() => setIsAuthenticated(true)}/></>

  return (<>
            <Header/>
            {children}
            <Footer/>
          </>);
}
