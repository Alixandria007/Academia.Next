'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatCPF, formatDate, formatPhone } from '@/utils/formatações';

interface Aluno {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  telefone: string;
  data_de_nascimento: string;
  foto?: string | null;
}

interface AvaliacaoFisica {
  peso: number;
  altura: number;
  gordura_corporal: number;
  data_avaliacao: string;
}

export default function AlunoDetalhe() {
  const { id } = useParams();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisica[]>([]);
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchAluno = async () => {
      try {
        const response = await fetch(`${API}/aluno/${id}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        setAluno(data);
      } catch (error) {
        console.error('Erro ao buscar o aluno:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAvaliacoes = async () => {
      try {
        const response = await fetch(`${API}/aluno/avaliacao_fisica/?id=${id}`, {
          credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
          setAvaliacoes(data);
        } else {
          console.error(data.detail);
        }
      } catch {
        console.error('Erro Desconhecido!!');
      }
    };

    fetchAluno();
    fetchAvaliacoes();
  }, [id]);

  if (loading) return <p className="text-center text-lg font-semibold text-gray-600">Carregando...</p>;
  if (!aluno) return <p className="text-center text-lg font-semibold text-red-500">Aluno não encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Detalhes do Aluno</h1>
      
      <div className="flex flex-col items-center mb-8">
        {aluno.foto ? (
          <img
            src={`http://127.0.0.1:8000/${aluno.foto}`}
            alt={`${aluno.first_name} ${aluno.last_name}`}
            className="w-40 h-40 rounded-full mb-6 shadow-md"
          />
        ) : (
          <div className="w-40 h-40 bg-gray-200 rounded-full mb-6 flex items-center justify-center shadow-md">
            <span className="text-gray-500">Sem Foto</span>
          </div>
        )}
        
        <h2 className="text-2xl font-semibold text-gray-700">{aluno.first_name} {aluno.last_name}</h2>
        <p className="text-gray-500 text-lg mb-6">{aluno.email}</p>

        <div className="bg-gray-100 p-6 rounded-lg shadow-sm w-full">
          <p><strong>CPF:</strong> {formatCPF(aluno.cpf)}</p>
          <p><strong>Telefone:</strong> {formatPhone(aluno.telefone)}</p>
          <p><strong>Data de Nascimento:</strong> {formatDate(aluno.data_de_nascimento)}</p>
        </div>
        
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => router.push(`/alunos/${aluno.id}/nova_avaliacao`)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Nova Avaliação
          </button>

          <button
            onClick={() => router.push(`/alunos/${aluno.id}/assinatura`)}
            className="px-5 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
          >
            Renovar Assinatura
          </button>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 text-center mt-10">Avaliações Físicas</h2>

      <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto mt-8">
        {avaliacoes.length === 0 ? (
          <p className="text-center text-lg text-gray-500">Este aluno ainda não possui avaliações físicas registradas.</p>
        ) : (
          <ul className="space-y-6">
            {avaliacoes.map((avaliacao, index) => (
              <li key={index} className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-lg font-medium text-gray-700"><strong>Peso:</strong> {avaliacao.peso} kg</p>
                  <p className="text-lg font-medium text-gray-700"><strong>Altura:</strong> {avaliacao.altura} m</p>
                  <p className="text-lg font-medium text-gray-700"><strong>Percentual de Gordura:</strong> {avaliacao.gordura_corporal} %</p>
                  <p className="text-lg font-medium text-gray-700"><strong>Data:</strong> {formatDate(avaliacao.data_avaliacao)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
