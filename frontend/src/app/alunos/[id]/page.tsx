'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Usando useParams e useRouter

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
    percentual_gordura: number;
    data: string;
  }

export default function AlunoDetalhe() {
  const { id } = useParams(); 
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisica[]>([]); 
  const router = useRouter();

  const fetchAluno = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/aluno/${id}`);
      
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

  useEffect(() => {
    if (id && typeof id === 'string') fetchAluno(id); 
  }, [id]);

  if (loading) return <p>Carregando...</p>;

  if (!aluno) return <p>Aluno não encontrado.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Aluno</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><strong>Nome:</strong> {aluno.first_name} {aluno.last_name}</p>
        <p><strong>Email:</strong> {aluno.email}</p>
        <p><strong>CPF:</strong> {aluno.cpf}</p>
        <p><strong>Telefone:</strong> {aluno.telefone}</p>
        <p><strong>Data de Nascimento:</strong> {aluno.data_de_nascimento}</p>

        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => router.push(`/alunos/${aluno.id}/nova_avaliacao`)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Nova Avaliação
          </button>
          

          <button
            onClick={() => router.push(`/alunos/${aluno.id}/atualizar`)}
            className="bg-yellow-300 text-white py-2 px-4 rounded-md hover:bg-yellow-500"
          >
            Renovar Assinatura
          </button>

        </div>
      </div>


      <h1 className="text-2xl font-bold my-4">Detalhes das Avalições Fisicas</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        
        {avaliacoes.length === 0 ? (
          <p className="text-center">Este aluno ainda não possui avaliações físicas registradas.</p>
        ) : (
          <ul>
            {avaliacoes.map((avaliacao, index) => (
              <li key={index} className="mb-4">
                <div>
                  <p><strong>Peso:</strong> {avaliacao.peso} kg</p>
                  <p><strong>Altura:</strong> {avaliacao.altura} m</p>
                  <p><strong>Percentual de Gordura:</strong> {avaliacao.percentual_gordura} %</p>
                  <p><strong>Data:</strong> {avaliacao.data}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
