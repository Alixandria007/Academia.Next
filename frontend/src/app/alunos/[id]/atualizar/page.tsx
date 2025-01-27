'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
  const router = useRouter();

  // Função para buscar o aluno
  const fetchAluno = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/aluno/${id}/`);
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do aluno');
      }
      const data = await response.json();
      setAluno(data);
    } catch (error) {
      setError('Falha ao carregar dados do aluno');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchAluno(id);
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (aluno) {
      const response = await fetch(`http://127.0.0.1:8000/aluno/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aluno),
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Aluno atualizado com sucesso!');
        router.push(`/alunos/${id}`);
      } else {
        console.log('Erro ao atualizar aluno.');
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!aluno) return <p>Aluno não encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl text-center font-bold mb-4">Atualizar Aluno</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="first_name"
            value={aluno.first_name}
            onChange={(e) => setAluno({ ...aluno, first_name: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="last_name"
            value={aluno.last_name}
            onChange={(e) => setAluno({ ...aluno, last_name: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={aluno.email}
            onChange={(e) => setAluno({ ...aluno, email: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            value={aluno.cpf}
            onChange={(e) => setAluno({ ...aluno, cpf: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            value={aluno.telefone}
            onChange={(e) => setAluno({ ...aluno, telefone: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="data_de_nascimento"
            value={aluno.data_de_nascimento}
            onChange={(e) => setAluno({ ...aluno, data_de_nascimento: e.target.value })}
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
