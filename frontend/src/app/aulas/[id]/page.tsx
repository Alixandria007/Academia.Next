'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatTime } from '@/utils/formatações';
import { apiUrl, frontendUrl } from '@/utils/imports';
import Link from 'next/link';
import Inscricoes from '@/components/Inscrições';

interface Instrutor {
  id: number;
  first_name: string;
  last_name: string;
  cref?: string;
  foto?: string;
}

interface Aula {
  id: number;
  nome: string;
  vagas: number;
  horario_inicial: string;
  horario_final: string;
  instrutor: Instrutor;
  tipo_atividade: {nome:string};
  dias_da_semana: { id: number; nome: string }[]; 
  alunos_inscritos: number;
}

export default function AulaDetalhes() {
  const { id } = useParams();
  const router = useRouter();
  const [aula, setAula] = useState<Aula | null>(null);
  const [inscricoes, setInscricoes] = useState<[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchAulaDetails = async () => {
      try {
        const response = await fetch(`${apiUrl()}/aula/${id}/`, { credentials: 'include' });

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
        const response = await fetch(`${apiUrl()}/aula/${id}/inscricao/`, { credentials: 'include' });

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
      const response = await fetch(`${apiUrl()}/aula/${id}/`, {
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
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-3xl border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{aula.nome}</h1>

      {errorMessage && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 text-center rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col items-center mb-8">
        {aula.instrutor?.foto ? (
          <img
            src={`${apiUrl()}/${aula.instrutor.foto}`}
            alt={`${aula.instrutor.first_name} ${aula.instrutor.last_name}`}
            className="w-40 h-40 rounded-full mb-6 shadow-md"
          />
        ) : (
          <div className="w-40 h-40 bg-gray-200 rounded-full mb-6 flex items-center justify-center shadow-md">
            <span className="text-gray-500">Sem Foto</span>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-blue-700">
          <Link href={`${frontendUrl()}/funcionarios/${aula.instrutor.id}`}>{aula.instrutor.first_name} {aula.instrutor.last_name}</Link>
        </h2>
        <p className="text-gray-500 text-lg mb-6">Instrutor</p>

        <div className="w-full bg-gray-100 p-6 rounded-lg shadow-sm">
          <p><strong>🕒 Horário:</strong> {formatTime(aula.horario_inicial)} - {formatTime(aula.horario_final)}</p>
          <p><strong>💼 Vagas:</strong> {aula.vagas}</p>
          <p><strong>📚 Alunos Matriculados:</strong> {aula.alunos_inscritos}</p>
          <p><strong>🎯 Tipo de Atividade:</strong> {aula.tipo_atividade.nome}</p>
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

    <Inscricoes data = {inscricoes}/>
    
    </>
  );
}
