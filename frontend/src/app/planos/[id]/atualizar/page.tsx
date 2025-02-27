'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Plano {
  nome: string;
  valor: number;
  duracao: string;
  atividade_extra: string[]; // Agora aceita múltiplas atividades
}

interface AtividadeExtra {
  id: string;
  descricao: string;
}

export default function AtualizarPlano() {
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;

  const [plano, setPlano] = useState<Plano>({
    nome: '',
    valor: 1,
    duracao: 'Men',
    atividade_extra: [], 
  });

  const [atividades, setAtividades] = useState<AtividadeExtra[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    async function fetchPlanoDetails() {
      try {
        const response = await fetch(`${API}/plano/${id}/`, {
          credentials: 'include',
        });

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
    }

    async function fetchAtividades() {
      try {
        const response = await fetch(`${API}/plano/atividade_extra/`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setAtividades(data);
        }
      } catch (error) {
        console.error('Erro ao carregar atividades extras:', error);
      }
    }

    fetchPlanoDetails();
    fetchAtividades();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlano((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAtividadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setPlano((prev) => ({
      ...prev,
      atividade_extra: selectedOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API}/plano/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plano),
        credentials: 'include',
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

        <div>
          <label className="block text-gray-700 font-medium">Atividades Extras</label>
          <select
            multiple
            name="atividade_extra"
            value={plano.atividade_extra}
            onChange={handleAtividadeChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            {atividades.map((atividade) => (
              <option key={atividade.id} value={atividade.id}>
                {atividade.descricao}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Segure CTRL (ou CMD no Mac) para selecionar múltiplas atividades.</p>
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
