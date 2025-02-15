'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let API = process.env.NEXT_PUBLIC_API
    
    if (!formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError('');

    try {
      const response = await fetch(`${API}/api/token/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.refresh(); // Sucesso, recarrega a página
      } else {
        const data = await response.json();
        setError(data.detail || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error); // Melhor tratamento de erro
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="user">Usuário</label>
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
  );
};

export default LoginForm;
