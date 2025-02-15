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

interface Inscricao {
    id: number;
    aluno: { id: number; first_name: string; last_name: string };
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

  const API = process.env.NEXT_PUBLIC_API


  useEffect(() => {
    const fetchAulaDetails = async () => {
      try {
        const response = await fetch(`${API}/aula/${id}/`,
          {credentials: 'include'}
        );

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
        const response = await fetch(`${API}/aula/${id}/inscricao/`,
          {credentials:'include'}
        );

        if (response.ok) {
          const data = await response.json();
          setInscricoes(data);
        } else {
          setErrorMessage('Erro ao carregar os inscrições dessa aula.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar os inscrições da aula.');
        console.error(error);
      }
    };


    fetchAulaDetails();
    fetchInscricoes();
  }, [id]);

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage("")
    }, 5000)
  }

  if (!aula) {
    return <div className="min-h-screen p-6 text-gray-600">Carregando detalhes da aula...</div>;
  }

  const HandleDelete = async () => {
    try{
    const response = await fetch(`${API}/aula/${id}/`, {
      method: "DELETE",
      credentials: 'include'
    })

    if (response.ok) {
      router.push("/aulas/")
    }

    else{
      const data = await response.json()
      setErrorMessage(data.detail)
      
    }
  }catch(error){
    setErrorMessage('Erro ao realizar a inscrição.');
    console.error(error);
  }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto my-3 p-8 space-6 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">{aula.nome}</h1>

        {errorMessage && <div className="p-4 mb-4 text-red-700 bg-red-100 text-center rounded">{errorMessage}</div>}

        <div className="flex items-center mb-8">
          {aula.instrutor?.foto ? (
              <img
              src={`http://127.0.0.1:8000/${aula.instrutor.foto}`}
              alt={`${aula.instrutor?.first_name} ${aula.instrutor?.last_name}`}
              className="w-32 h-32 rounded-full object-cover border-2 border-blue-500 mr-6"
              />
          ) : (
              <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl mr-6">
              Sem Foto
              </div>
          )}
          <div>
              <p className="text-2xl font-semibold text-gray-800">
              {aula.instrutor?.first_name} {aula.instrutor?.last_name}
              </p>
              {aula.instrutor?.cref && (
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
            <p className="text-gray-800 text-xl">{aula.alunos_inscritos}</p>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Dias da Semana</h2>
            <p className="text-gray-800 text-xl">
              {aula.dias_da_semana.map((dia) => dia.nome).join(', ')}
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <button
              onClick={() => router.push(`${id}/inscricao/`)}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Realizar Inscrição
          </button>

          <div className='flex gap-2'>
            <button
              onClick={() => router.push(`${id}/atualizar/`)}
              className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Editar Aula
            </button>

            <button
              onClick={() => HandleDelete()}
              className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Deletar Aula
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto my-3 p-8 space-6 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Inscrições</h1>
        {inscricoes.length > 0 ? (
          <ul className="space-y-4">
            {inscricoes.map((inscricao) => (
              <li key={inscricao.id} className="p-4 bg-gray-100 rounded-lg shadow-inner">
                <p className="text-lg font-medium">
                  {inscricao.aluno.first_name} {inscricao.aluno.last_name}
                </p>
                {// @ts-ignore
                <p className="text-gray-600"><strong>Email:</strong> {inscricao.aluno.email}</p>}
                <p className="text-gray-600"><strong>Data de Inscrição:</strong> {inscricao.data_inscricao}</p>
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
