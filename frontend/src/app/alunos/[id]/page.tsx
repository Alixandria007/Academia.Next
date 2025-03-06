'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatCPF, formatDate, formatPhone } from '@/utils/formatações';
import { apiUrl, frontendUrl } from '@/utils/imports';
import Link from 'next/link';

interface Aluno {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  telefone: string;
  data_de_nascimento: string;
  ativo: boolean;
  foto?: string | null;
}

interface AvaliacaoFisica {
  peso: number;
  altura: number;
  gordura_corporal: number;
  data_avaliacao: string;
}

interface Assinatura {
  id: number;
  plano: { nome: string };
  data_assinatura: string;
  vencimento: string;
}

export default function AlunoDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisica[]>([]);
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchAluno = async () => {
      try {
        const response = await fetch(`${apiUrl()}/aluno/${id}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Erro ao buscar aluno.');

        const data = await response.json();
        setAluno(data);
      } catch (error) {
        setErrorMessage('Erro ao carregar os detalhes do aluno.');
      } finally {
        setLoading(false);
      }
    };

    const fetchAvaliacoes = async () => {
      try {
        const response = await fetch(`${apiUrl()}/aluno/avaliacao_fisica/?id=${id}`, {
          credentials: 'include',
        });
        if (response.ok) setAvaliacoes(await response.json());
      } catch {
        console.error('Erro ao buscar avaliações físicas.');
      }
    };

    const fetchAssinatura = async () => {
      try {
        const response = await fetch(`${apiUrl()}/plano/assinatura/?aluno_id=${id}`, {
          credentials: 'include',
        });
        if (response.ok) setAssinatura(await response.json());
      } catch {
        console.error('Erro ao buscar assinatura.');
      }
    };

    fetchAluno();
    fetchAvaliacoes();
    fetchAssinatura();
  }, [id]);

  if (loading) return <div className="text-center text-gray-500 mt-10">Carregando...</div>;
  if (!aluno) return <div className="text-center text-red-500 mt-10">Aluno não encontrado.</div>;

  return (
    <>
      <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-3xl border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Detalhes do Aluno</h1>

        {errorMessage && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 text-center rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col items-center mb-8">
          {aluno.foto ? (
            <img
              src={`${apiUrl()}/${aluno.foto}`}
              alt={`${aluno.first_name} ${aluno.last_name}`}
              className="w-40 h-40 rounded-full mb-6 shadow-md"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-200 rounded-full mb-6 flex items-center justify-center shadow-md">
              <span className="text-gray-500">Sem Foto</span>
            </div>
          )}

          <h2 className="text-2xl font-semibold">
            {aluno.first_name} {aluno.last_name}
          </h2>
          <p className="text-gray-500 text-lg mb-6">{aluno.email}</p>

          <div className="w-full bg-gray-100 p-6 rounded-lg shadow-sm">
            <p><strong>📅 Data de Nascimento:</strong> {formatDate(aluno.data_de_nascimento)}</p>
            <p><strong>📞 Telefone:</strong> {formatPhone(aluno.telefone)}</p>
            <p><strong>🆔 CPF:</strong> {formatCPF(aluno.cpf)}</p>
            <p>📋<strong>Plano Ativo:</strong> { assinatura ?<Link href={`${frontendUrl()}/planos/${assinatura.id}`}><span className='text-blue-600'>{assinatura.plano.nome}</span></Link> : "Não há"}</p>
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => router.push(`/alunos/${aluno.id}/nova_avaliacao`)}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
            >
              📊 Nova Avaliação
            </button>
            <button
              onClick={() => router.push(`/alunos/${aluno.id}/assinatura`)}
              className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              📋 Renovar Assinatura
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-3xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Avaliações Físicas</h2>
        {avaliacoes.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma avaliação registrada.</p>
        ) : (
          <ul className="space-y-6">
            {avaliacoes.map((avaliacao, index) => (
              <li key={index} className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                <p><strong>⚖️ Peso:</strong> {avaliacao.peso} kg</p>
                <p><strong>📏 Altura:</strong> {avaliacao.altura} m</p>
                <p><strong>📊 Gordura Corporal:</strong> {avaliacao.gordura_corporal} %</p>
                <p><strong>📆 Data:</strong> {formatDate(avaliacao.data_avaliacao)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
