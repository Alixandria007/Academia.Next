'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Plano {
  nome: string;
  valor: number;
  duracao: string;
  aulas: boolean;
}

export default function AtualizarPlano() {
  const { id } = useParams();
  const router = useRouter();
  const [plano, setPlano] = useState<Plano>({
    nome: '',
    valor: 1,
    duracao: 'Men',
    aulas: false,
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const fetchPlanoDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/plano/${id}/`);

        if (response.ok) {
          const data = await response.json();
          setPlano(data);
        } else {
          setErrorMessage('Erro ao carregar detalhes do plano.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar detalhes do plano.');
        console.error(error);
      }
    };

    fetchPlanoDetails();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    {// @ts-ignore
        const { name, value, type, checked } = e.target;
    setPlano((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`http://127.0.0.1:8000/plano/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(plano),
      });

      if (response.ok) {
        setSuccessMessage('Plano atualizado com sucesso!');
        setTimeout(() => router.push('/planos/'), 2000);
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || 'Erro ao atualizar plano.');
      }
    } catch (error) {
      setErrorMessage('Erro ao atualizar plano.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">Atualizar Plano</h1>

      {errorMessage && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 text-center rounded">{errorMessage}</div>
      )}

      {successMessage && (
        <div className="p-4 mb-6 text-green-700 bg-green-100 text-center rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium">Nome do Plano</label>
            <input
              type="text"
              name="nome"
              value={plano.nome}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Valor (R$)</label>
            <input
              type="number"
              name="valor"
              value={plano.valor}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              min="1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Duração</label>
          <select
            name="duracao"
            value={plano.duracao}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="Men">Mensal</option>
            <option value="Tri">Trimestral</option>
            <option value="Sem">Semestral</option>
            <option value="Anual">Anual</option>
          </select>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <input
            type="checkbox"
            name="aulas"
            checked={plano.aulas}
            onChange={handleInputChange}
            className="w-5 h-5"
          />
          <label className="text-gray-700">Aulas Inclusas</label>
        </div>

        <div className="flex justify-between mt-10">
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Atualizar Plano
          </button>

          <button
            type="button"
            onClick={() => router.push('/planos/')}
            className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
