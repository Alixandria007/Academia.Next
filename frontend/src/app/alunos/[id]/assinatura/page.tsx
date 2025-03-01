'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Plano {
  id: number;
  nome: string;
  valor: number;
  duracao: string;
}

export default function CriarAssinatura() {
  const router = useRouter();
  const {id} = useParams()
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [selectedPlano, setSelectedPlano] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [valor, setValor] = useState<number | null>(null)
  const [duracao, setDuracao] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('');
  const API = process.env.NEXT_PUBLIC_API

  useState(() => {
    const fetchPlanos = async () => {
      try {
        const response = await fetch(`${API}/plano/`,{
          credentials:'include'
        });
        if (response.ok) {
          const data = await response.json();
          setPlanos(data);
        } else {
          setErrorMessage('Erro ao carregar planos.');
        }
      } catch (error) {
        setErrorMessage('Erro ao buscar planos.');
      }
    };
    fetchPlanos();
  });

  const handleAssinatura = async () => {
    if (!selectedPlano || !id) {
      setErrorMessage('Selecione um plano e informe o ID do aluno.');
      return;
    }

    try {
      const response = await fetch(`${API}/plano/assinatura/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plano: selectedPlano,
          valor: valor,
          aluno: Number(id),
          duracao: duracao
        }),
        credentials:'include'
      });

      if (response.ok) {
        setSuccessMessage('Assinatura criada com sucesso!');
        setErrorMessage('');
        router.push('');
      } else {
        const data = await response.json();
        setErrorMessage(`Erro ao criar assinatura: ${data.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      setErrorMessage('Erro ao processar a assinatura.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-4 p-8 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Criar Nova Assinatura
      </h1>

      {errorMessage && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          {successMessage}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-lg mb-2">Selecione um Plano</label>
        <ul className="border rounded-lg">
          {planos.length > 0 ? (
            planos.map((plano) => (
              <li
                key={plano.id}
                className={`p-4 border-b cursor-pointer ${
                  selectedPlano === plano.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => {setSelectedPlano(plano.id)
                    setValor(plano.valor)
                    setDuracao(plano.duracao)
                }}
              >
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">{plano.nome} - {plano.duracao}</span>
                  <span className="text-gray-600">{`R$ ${plano.valor}`}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-gray-600 text-center">
              Nenhum plano disponível.
            </li>
          )}
        </ul>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleAssinatura}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Confirmar Assinatura
        </button>

        <button
          onClick={() => router.push('/planos')}
          className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
