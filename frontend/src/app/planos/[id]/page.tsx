'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDuracao } from '@/utils/formatações';

interface Plano {
  nome: string;
  valor: number;
  duracao: string;
  atividade_extra: string[]; // Agora aceita múltiplas atividades
}

interface AtividadeExtra {
  id: string;
  descricao: string;
}

export default function DetalhesPlano() {
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;

  const [plano, setPlano] = useState<Plano | null>(null);
  const [atividades, setAtividades] = useState<AtividadeExtra[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar o plano
  const fetchPlano = async () => {
    if (!id || typeof id !== 'string') return;

    try {
      const response = await fetch(`${API}/plano/${id}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setPlano(data);
      } else {
        setError('Erro ao carregar plano');
      }
    } catch (error) {
      setError('Erro ao carregar plano');
      console.error(error);
    }
  };

  // Função para buscar as atividades extras
  const fetchAtividades = async () => {
    try {
      const response = await fetch(`${API}/plano/atividade_extra/`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setAtividades(data);
      } else {
        setError('Erro ao carregar atividades extras');
      }
    } catch (error) {
      setError('Erro ao carregar atividades extras');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlano();
    fetchAtividades();
    setLoading(false); // Assume que a carga inicial já terminou.
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!plano) {
    return <div className="text-center text-red-500 mt-10">Plano não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mb-10 p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Detalhes do Plano</h1>
      <div className="w-full bg-gray-100 p-6 rounded-lg shadow-sm">
        <p><strong>Nome do Plano:</strong> {plano.nome}</p>
        <p><strong>Valor (R$):</strong> {plano.valor}</p>
        <p><strong>Duração:</strong> {formatDuracao(plano.duracao)}</p>
        <p><strong>Atividades Extras:</strong></p>
        {plano.atividade_extra.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {plano.atividade_extra.map((atividadeId) => {
              const atividade = atividades.find((item) => item.id === atividadeId);
              return atividade ? (
                <li key={atividade.id} className="text-gray-700">{atividade.descricao}</li>
              ) : null;
            })}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhuma atividade extra cadastrada.</p>
        )}
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => router.push(`/planos/${plano.nome}/editar`)}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => router.push('/planos/')}
          className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          ↩ Voltar
        </button>
      </div>
    </div>
  );
}
