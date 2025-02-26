'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../Header';
import Footer from '../Footer';
import LoginPage from '../Login';

async function verifyTokens() {
  let API = process.env.NEXT_PUBLIC_API;
  
  try {
    const response = await fetch(`${API}/api/token/verify/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const refreshResponse = await fetch(`${API}/api/token/refresh/`, {
        method: 'POST',
        credentials: 'include', 
      });

      if (!refreshResponse.ok) {
        return false;  
      }
    }

    return true;  
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return false;
  }
}

export default function AuthComponent({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyTokens();
      setIsAuthenticated(isValid);
      
      if (isValid) {
        router.refresh(); 
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      checkAuth(); 
    }, 10000); 

    return () => clearInterval(interval);
  }, []); 

  if (isAuthenticated === null) {
    
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;  
  }

  return (
    <>
      <Header />
      {children}  
      <Footer />
    </>
  );
}
