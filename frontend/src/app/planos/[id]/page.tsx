'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Plano {
  id: number;
  nome: string;
  valor: number;
  duracao: string;
  aulas: boolean;
}

export default function PlanoDetalhes() {
  const { id } = useParams();
  const router = useRouter();
  const [plano, setPlano] = useState<Plano | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const API = process.env.NEXT_PUBLIC_API

  useEffect(() => {
    const fetchPlanoDetails = async () => {
      try {
        const response = await fetch(`${API}/plano/${id}/`, {
          credentials:'include'
        });

        if (response.ok) {
          const data = await response.json();
          setPlano(data);
        } else {
          setErrorMessage('Erro ao carregar os detalhes do plano.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar os detalhes do plano.');
        console.error(error);
      }
    };

    fetchPlanoDetails();
  }, [id]);

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  }

  if (!plano) {
    return <div className="min-h-screen p-6 text-gray-600">Carregando detalhes do plano...</div>;
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API}/plano/${id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/planos/');
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || 'Erro ao excluir o plano.');
      }
    } catch (error) {
      setErrorMessage('Erro ao excluir o plano.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-5xl font-extrabold text-blue-600 text-center">{plano.nome}</h1>

      {errorMessage && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 text-center rounded">{errorMessage}</div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mt-8">
        <div className="space-y-4 text-center md:text-left">
          <p className="text-2xl text-gray-700">
            <strong>Valor:</strong> <span className="text-blue-500 font-bold">R$ {plano.valor}</span>
          </p>
          <p className="text-xl text-gray-600">
            <strong>Duração:</strong> {plano.duracao}
          </p>
          <p className="text-xl text-gray-600">
            <strong>Atiidades Extras:</strong> {plano.aulas ? 'Sim' : 'Não'}
          </p>
        </div>

        <div className="flex gap-4 mt-6 md:mt-0">
          <button
            onClick={() => router.push(`/planos/${id}/atualizar/`)}
            className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Editar
          </button>

          <button
            onClick={handleDelete}
            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => router.push('/planos/')}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Voltar para Lista de Planos
        </button>
      </div>
    </div>
  );
}
