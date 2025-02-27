'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatCPF, formatPhone } from '@/utils/formatações';

interface Aluno {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  telefone: string;
  data_de_nascimento: string;
}

export default function UpdateAluno() {
  const { id } = useParams();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const response = await fetch(`${API}/aluno/${id}/`, {
          credentials: "include"
        });
        if (!response.ok) throw new Error('Erro ao carregar dados do aluno');

        const data = await response.json();
        setAluno(data);
      } catch (error) {
        setError('Falha ao carregar dados do aluno');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAluno();
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cpf') formattedValue = formatCPF(value);
    else if (name === 'telefone') formattedValue = formatPhone(value);

    if (aluno) {
      setAluno({ ...aluno, [name]: formattedValue });
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!aluno) return;

    try {
      const response = await fetch(`${API}/aluno/${id}/`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aluno),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Erro ao atualizar aluno');

      setSuccessMessage('Aluno atualizado com sucesso!');
      setTimeout(() => router.push(`/alunos/${id}`), 2000);
    } catch (error) {
      setError('Erro ao atualizar aluno. Tente novamente.');
    }
  };


  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!aluno) return <p>Aluno não encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl text-center font-bold mb-4">Atualizar Aluno</h1>

      {successMessage && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            name="first_name"
            value={aluno.first_name}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
          <input
            type="text"
            name="last_name"
            value={aluno.last_name}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={aluno.email}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">CPF</label>
          <input
            type="text"
            name="cpf"
            value={aluno.cpf}
            onChange={handleInputChange}
            maxLength={14}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="text"
            name="telefone"
            value={aluno.telefone}
            onChange={handleInputChange}
            maxLength={11}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
          <input
            type="date"
            name="data_de_nascimento"
            value={aluno.data_de_nascimento}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Atualizar
          </button>
          <button
            type="button"
            onClick={() => router.push(`/alunos/${id}`)}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
