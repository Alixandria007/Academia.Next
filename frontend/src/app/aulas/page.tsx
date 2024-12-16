'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Aula {
  id: number;
  nome: string;
  vagas: number;
  horario_inicial: string;
  horario_final: string;
  instrutor: { id: number; first_name: string; last_name: string; foto?: string };
}

export default function Aulas() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [filteredAulas, setFilteredAulas] = useState<Aula[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/aula/');

        if (response.ok) {
          const data = await response.json();
          setAulas(data);
          setFilteredAulas(data);
        } else {
          setErrorMessage('Erro ao carregar a lista de aulas.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar a lista de aulas.');
        console.error(error);
      }
    };

    fetchAulas();
  }, []);

  const handleNavigateToDetails = (id: number) => {
    router.push(`/aulas/${id}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.toLowerCase();
    setSearchTerm(search);

    const filtered = aulas.filter((aula) =>
      aula.nome.toLowerCase().includes(search) ||
      aula.instrutor.first_name.toLowerCase().includes(search) ||
      aula.instrutor.last_name.toLowerCase().includes(search) ||
      aula.horario_inicial.includes(search) ||
      aula.horario_final.includes(search)
    );

    setFilteredAulas(filtered);
  };

  return (
    <div className='min-h-screen'>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Lista de Aulas</h1>

        {errorMessage && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{errorMessage}</div>
        )}

        <div className="mb-6">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Buscar por nome, instrutor ou horário"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <ul>
          {filteredAulas.length > 0 ? (
            filteredAulas.map((aula) => (
              <li
                key={aula.id}
                className="p-4 mb-4 border rounded-md shadow-sm flex items-center hover:bg-gray-100 transition cursor-pointer"
                onClick={() => handleNavigateToDetails(aula.id)}
              >
                <div className="flex-shrink-0 mr-4">
                  {aula.instrutor.foto ? (
                    <img
                      src={`http://127.0.0.1:8000/${aula.instrutor.foto}`}
                      alt={`${aula.instrutor.first_name} ${aula.instrutor.last_name}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-center">Sem Foto</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-lg font-semibold">{aula.nome}</p>
                  <p className="text-gray-600">{`${aula.instrutor.first_name} ${aula.instrutor.last_name}`}</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Horário:</span> {`${aula.horario_inicial} - ${aula.horario_final}`}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Vagas:</span> {aula.vagas}
                  </p>
                </div>
                <span className="text-blue-500 font-medium">Ver Detalhes →</span>
              </li>
            ))
          ) : (
            <p className="text-gray-600 text-center">Nenhuma aula encontrada.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
