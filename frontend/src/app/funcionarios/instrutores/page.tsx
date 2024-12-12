'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Instrutor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cref?: string;
  entrada: string;
  saida: string;
  foto?: string; 
}

export default function Instrutores() {
  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchInstrutores = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/funcionario/instrutores/');

        if (response.ok) {
          const data = await response.json();
          setInstrutores(data);
        } else {
          setErrorMessage('Erro ao carregar a lista de instrutores.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar a lista de instrutores.');
        console.error(error);
      }
    };

    fetchInstrutores();
  }, []);

  const handleNavigateToDetails = (id: number) => {
    router.push(`/funcionarios/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Instrutores</h1>

      {errorMessage && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{errorMessage}</div>
      )}

      <ul>
        {instrutores.length > 0 ? (
          instrutores.map((instrutor) => (
            <li
              key={instrutor.id}
              className="p-4 mb-4 border rounded-md shadow-sm flex items-center hover:bg-gray-100 transition cursor-pointer"
              onClick={() => handleNavigateToDetails(instrutor.id)}
            >
              {instrutor.foto ? (
                <img
                src={`http://127.0.0.1:8000/${instrutor.foto}`}
                  alt={`${instrutor.first_name} ${instrutor.last_name}`}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                  <span className="text-gray-500 text-center">Sem Foto</span>
                </div>
              )}

              <div className="flex-1">
                <p className="text-lg font-semibold">{`${instrutor.first_name} ${instrutor.last_name}`}</p>
                <p className="text-gray-600">{instrutor.email}</p>
                {instrutor.cref && (
                  <p className="text-sm text-blue-600">CREF: {instrutor.cref}</p>
                )}
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Entrada:</span> {instrutor.entrada}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Saída:</span> {instrutor.saida}
                </p>
              </div>
              <span className="text-blue-500 font-medium">Ver Detalhes →</span>
            </li>
          ))
        ) : (
          <p className="text-gray-600 text-center">Nenhum instrutor encontrado.</p>
        )}
      </ul>
    </div>
  );
}
