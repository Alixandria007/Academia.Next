'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatTime } from '@/utils/formatações';

interface Instrutor {
  id: number;
  first_name: string;
  last_name: string;
  cref?: string;
  foto?: string;
}

interface Inscricao {
  id: number;
  aluno: { id: number; first_name: string; last_name: string; email: string };
  data_inscricao: string;
}

interface Aula {
  id: number;
  nome: string;
  vagas: number;
  horario_inicial: string;
  horario_final: string;
  instrutor: Instrutor;
  dias_da_semana: { id: number; nome: string }[]; 
  alunos_inscritos: number;
}

export default function AulaDetalhes() {
  const { id } = useParams();
  const router = useRouter();
  const [aula, setAula] = useState<Aula | null>(null);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const API = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    const fetchAulaDetails = async () => {
      try {
        const response = await fetch(`${API}/aula/${id}/`, { credentials: 'include' });

        if (response.ok) {
          const data = await response.json();
          setAula(data);
        } else {
          setErrorMessage('Erro ao carregar os detalhes da aula.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar os detalhes da aula.');
        console.error(error);
      }
    };

    const fetchInscricoes = async () => {
      try {
        const response = await fetch(`${API}/aula/${id}/inscricao/`, { credentials: 'include' });

        if (response.ok) {
          const data = await response.json();
          setInscricoes(data);
        } else {
          setErrorMessage('Erro ao carregar as inscrições dessa aula.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar as inscrições da aula.');
        console.error(error);
      }
    };

    fetchAulaDetails();
    fetchInscricoes();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API}/aula/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/aulas/');
      } else {
        const data = await response.json();
        setErrorMessage(data.detail);
      }
    } catch (error) {
      setErrorMessage('Erro ao realizar a exclusão da aula.');
      console.error(error);
    }
  };

  if (!aula) {
    return <div className="text-center text-gray-500 mt-10">Carregando...</div>;
  }

  return (
    <>
    <div className="max-w-4xl mx-auto mb-10 p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{aula.nome}</h1>

      {errorMessage && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 text-center rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col items-center mb-8">
        {aula.instrutor?.foto ? (
          <img
            src={`http://127.0.0.1:8000/${aula.instrutor.foto}`}
            alt={`${aula.instrutor.first_name} ${aula.instrutor.last_name}`}
            className="w-40 h-40 rounded-full mb-6 shadow-md"
          />
        ) : (
          <div className="w-40 h-40 bg-gray-200 rounded-full mb-6 flex items-center justify-center shadow-md">
            <span className="text-gray-500">Sem Foto</span>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-gray-700">
          {aula.instrutor.first_name} {aula.instrutor.last_name}
        </h2>
        <p className="text-gray-500 text-lg mb-6">Instrutor</p>

        <div className="w-full bg-gray-100 p-6 rounded-lg shadow-sm">
          <p><strong>🕒 Horário:</strong> {formatTime(aula.horario_inicial)} - {formatTime(aula.horario_final)}</p>
          <p><strong>💼 Vagas:</strong> {aula.vagas}</p>
          <p><strong>📚 Alunos Matriculados:</strong> {aula.alunos_inscritos}</p>
          <p><strong>📅 Dias da Semana:</strong> {aula.dias_da_semana.map((dia) => dia.nome).join(', ')}</p>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => router.push(`${id}/inscricao/`)}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ✏️ Realizar Inscrição
          </button>
          <button
            onClick={() => router.push(`${id}/atualizar/`)}
            className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            ✏️ Editar Aula
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            🗑 Deletar Aula
          </button>
        </div>
      </div>
    </div>

    <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto my-5">
        <h2 className="text-3xl font-bold text-center mb-6">Inscrições</h2>
        {inscricoes.length > 0 ? (
          <ul className="space-y-6">
            {inscricoes.map((inscricao) => (
              <li key={inscricao.id} className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all">
                <p className="text-xl font-medium text-gray-800">
                  {inscricao.aluno.first_name} {inscricao.aluno.last_name}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Email:</strong> {inscricao.aluno.email}
                </p>
                <p className="text-gray-600 mt-1">
                  <strong>Data de Inscrição:</strong> {inscricao.data_inscricao}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">Nenhuma inscrição encontrada.</p>
        )}
      </div>
    </>
  );
}
