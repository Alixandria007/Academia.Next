'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Usando useParams e useRouter
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
  const API = process.env.NEXT_PUBLIC_API 
  const router = useRouter();

  const fetchAluno = async (id: string) => {
    try {
      const response = await fetch(`${API}/aluno/${id}`,{
        headers:{
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados do aluno:', data); 
      setAluno(data);
    } catch (error) {
      console.error('Erro ao buscar o aluno:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvaliacoes = async () => {
    try{
    const response = await fetch(`http://127.0.0.1:8000/aluno/avaliacao_fisica/?id=${id}`,{
      credentials: 'include'
    }
    );
    const data = await response.json()

    if (response.ok){
      setAvaliacoes(data)
    }

    else{
      console.error(data.detail)
    }

    }

    catch{
        console.error('Erro Desconhecido!!')
    }

  }

  useEffect(() => {
    if (id && typeof id === 'string') fetchAluno(id); fetchAvaliacoes(); 
  }, [id]);

  if (loading) return <p>Carregando...</p>;

  if (!aluno) return <p>Aluno não encontrado.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Aluno</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><strong>Nome:</strong> {aluno.first_name} {aluno.last_name}</p>
        <p><strong>Email:</strong> {aluno.email}</p>
        <p><strong>CPF:</strong> {formatCPF(aluno.cpf)}</p>
        <p><strong>Telefone:</strong> {formatPhone(aluno.telefone)}</p>
        <p><strong>Data de Nascimento:</strong> {aluno.data_de_nascimento}</p>

        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => router.push(`/alunos/${aluno.id}/nova_avaliacao`)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Nova Avaliação
          </button>
          

          <button
            onClick={() => router.push(`/alunos/${aluno.id}/assinatura`)}
            className="bg-yellow-300 text-white py-2 px-4 rounded-md hover:bg-yellow-500"
          >
            Renovar Assinatura
          </button>

        </div>
      </div>


      <h1 className="text-3xl font-extrabold my-6 text-center text-gray-800">Detalhes das Avaliações Físicas</h1>

<div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
  {avaliacoes.length === 0 ? (
    <p className="text-center text-xl text-gray-500">Este aluno ainda não possui avaliações físicas registradas.</p>
  ) : (
    <ul className="space-y-6">
      {avaliacoes.map((avaliacao, index) => (
        <li key={index} className="bg-gray-50 p-6 rounded-lg shadow-md">
          <div>
            <p className="text-lg font-medium text-gray-700"><strong>Peso:</strong> {avaliacao.peso} kg</p>
            <p className="text-lg font-medium text-gray-700"><strong>Altura:</strong> {avaliacao.altura} m</p>
            <p className="text-lg font-medium text-gray-700"><strong>Percentual de Gordura:</strong> {avaliacao.gordura_corporal} %</p>
            <p className="text-lg font-medium text-gray-700"><strong>Data:</strong> {avaliacao.data_avaliacao}</p>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

    </div>
  );
}
