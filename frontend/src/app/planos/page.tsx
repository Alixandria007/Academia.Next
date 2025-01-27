'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Plano {
  id: number;
  nome: string;
  valor: number;
  duracao: string;
  aulas: boolean;
}

export default function PlanosConsulta() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/plano/', {
          credentials:'include'
        });

        if (response.ok) {
          const data = await response.json();
          setPlanos(data);
        } else {
          setErrorMessage('Erro ao carregar os planos.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar os planos.');
        console.error(error);
      }
    };

    fetchPlanos();
  }, []);

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-8 my-3 space-y-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">Planos Disponíveis</h1>

      {errorMessage && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 text-center rounded">{errorMessage}</div>
      )}

      {planos.length > 0 ? (
        <div className="space-y-4">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className="flex justify-between items-center p-6 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md transition"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{plano.nome}</h2>
                <p className="text-gray-600 mt-1">
                  {plano.duracao} | {plano.aulas ? 'Inclui Aulas' : 'Sem Aulas'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">R$ {plano.valor}</p>
                <button
                  onClick={() => router.push(`/planos/${plano.id}/`)}
                  className="mt-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">Nenhum plano disponível.</p>
      )}
    </div>
  );
}
