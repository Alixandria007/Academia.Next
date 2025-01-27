'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
//@ts-ignore
import Cookies from 'js-cookie';

export const revalidate = 10;

export default function AuthComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  const csrfToken = Cookies.get('csrftoken')

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
            router.push('/login/')
          }
        } catch (error) {
          console.error('Erro ao tentar atualizar o token:', error);
          router.push('/login/')

        }
      };

      const checkAccessToken = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/token/verify/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken, 
          },
            credentials: 'include',
          });

          if (!response.ok) {
            console.warn('Token inválido, tentando atualizar...');
            await refreshAccessToken();
          }
        } catch (error) {
          console.error('Erro ao verificar o token:', error);
          router.push('/login/')
        }
      };

      await checkAccessToken();
      setIsLoading(false);
    };

    verifyTokens();
  }, []);

  if (isLoading) return null;

  return <>{children}</>;
}
