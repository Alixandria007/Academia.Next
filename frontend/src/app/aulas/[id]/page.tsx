'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

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
  dias_da_semana: { id: number; nome: string }[];
  num_alunos_matriculados: number; 
}

export default function AulaDetalhes() {
  const { id } = useParams();
  const router = useRouter();
  const [aula, setAula] = useState<Aula | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchAulaDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/aula/${id}/`);

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

    fetchAulaDetails();
  }, [id]);

  if (errorMessage) {
    return <div className="p-6 text-red-700 bg-red-100 rounded">{errorMessage}</div>;
  }

  if (!aula) {
    return <div className="p-6 text-gray-600">Carregando detalhes da aula...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">{aula.nome}</h1>

      <div className="flex items-center mb-8">
        {aula.instrutor.foto ? (
            <img
            src={`http://127.0.0.1:8000/${aula.instrutor.foto}`}
            alt={`${aula.instrutor.first_name} ${aula.instrutor.last_name}`}
            className="w-32 h-32 rounded-full object-cover border-2 border-blue-500 mr-6"
            />
        ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl mr-6">
            Sem Foto
            </div>
        )}
        <div>
            <p className="text-2xl font-semibold text-gray-800">
            {aula.instrutor.first_name} {aula.instrutor.last_name}
            </p>
            {aula.instrutor.cref && (
            <p className="text-gray-600 mt-1">
                <span className="font-medium">CREF:</span> {aula.instrutor.cref}
            </p>
            )}
            <p className="text-gray-600 mt-1">Instrutor</p>
        </div>
        </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Horário</h2>
          <p className="text-gray-800 text-xl">
            {aula.horario_inicial} - {aula.horario_final}
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Vagas</h2>
          <p className="text-gray-800 text-xl">{aula.vagas}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Alunos Matriculados</h2>
          <p className="text-gray-800 text-xl">{aula.num_alunos_matriculados}</p>
        </div>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg shadow-inner mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Dias da Semana</h2>
        <p className="text-gray-800 text-xl">
          {aula.dias_da_semana.map((dia) => dia.nome).join(', ')}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => router.push('/aulas')}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Voltar para a Lista de Aulas
        </button>
      </div>
    </div>
  );
}
