'use client'

//@ts-ignore
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface FormData {
  username: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
  const [error, setError] = useState<string>('');
  const router = useRouter()
  const csrfToken = Cookies.get('csrftoken')
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username === '' || formData.password === '') {
      setError('Por favor, preencha todos os campos.');
    } else {
      setError('');
      
      const fetchSubmit = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/token/',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, 
        },
          credentials:'include',
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok){
          router.push('/')
        }
        else{
          setError(data.detail)
        }
      };

      fetchSubmit()
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="user">User</label>
            <input
              type="text"
              name="username"
              id="user"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700">
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
