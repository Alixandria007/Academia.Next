'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Aluno {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function InscricaoAula() {
  const { id: aulaId } = useParams();
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const API = process.env.NEXT_PUBLIC_API


  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await fetch(`${API}/aluno/`,{
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setAlunos(data);
          setFilteredAlunos(data);
        } else {
          setErrorMessage('Erro ao carregar a lista de alunos.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar a lista de alunos.');
        console.error(error);
      }
    };

    fetchAlunos();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = alunos.filter((aluno) =>
      `${aluno.first_name} ${aluno.last_name}`.toLowerCase().includes(term) ||
      aluno.email.toLowerCase().includes(term)
    );

    setFilteredAlunos(filtered);
  };

  const handleInscricao = async () => {
    if (!selectedAluno) {
      alert('Por favor, selecione um aluno para realizar a inscrição.');
      return;
    }

    try {
      const response = await fetch(`${API}/aula/inscricao/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aluno: selectedAluno,
          aula: aulaId,
        }),
        credentials: 'include'
      });

      if (response.ok) {
        setSuccessMessage('Inscrição realizada com sucesso!');
        setErrorMessage('');
        router.push(`/aula/${aulaId}}`)
      } else {
        const data = await response.json();
        setErrorMessage(`Erro na inscrição: ${data.detail || 'Erro desconhecido'}`);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Erro ao realizar a inscrição.');
      console.error(error);
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-4 p-8 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Inscrição na Aula</h1>

      {errorMessage && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{errorMessage}</div>}
      {successMessage && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">{successMessage}</div>}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar aluno por nome ou e-mail"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
      </div>

      <ul className="border rounded-lg">
        {filteredAlunos.length > 0 ? (
          filteredAlunos.map((aluno) => (
            <li
              key={aluno.id}
              className={`p-4 border-b cursor-pointer ${
                selectedAluno === aluno.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedAluno(aluno.id)}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{`${aluno.first_name} ${aluno.last_name}`}</span>
                <span className="text-gray-600">{aluno.email}</span>
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-gray-600 text-center">Nenhum aluno encontrado.</li>
        )}
      </ul>
      <div className='flex justify-between mt-6'>
        <div>
          <button
            onClick={handleInscricao}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Confirmar Inscrição
          </button>
        </div>

        <div>
          <button
            onClick={() => router.push(`/aulas/${aulaId}`)}
            className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Voltar para Detalhes da Aula
          </button>
        </div>
      </div>
    </div>
  );
}
