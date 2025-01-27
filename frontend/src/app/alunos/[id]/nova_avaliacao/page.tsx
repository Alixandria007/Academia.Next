'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface AvaliacaoFisicaFormData {
  aluno: number;
  peso: string;
  altura: string;
  gordura_corporal: string;
  massa_muscular: string;
  circunferencia_abdominal: string;
}

export default function CadastrarAvaliacaoFisica() {
  const router = useRouter();
  const {id} = useParams()

  const [formData, setFormData] = useState<AvaliacaoFisicaFormData>({
    aluno: Number(id),
    peso: '',
    altura: '',
    gordura_corporal: '',
    massa_muscular: '',
    circunferencia_abdominal: '',
  });

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/aluno/avaliacao_fisica/', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData}),
        credentials: 'include'
      });

      if (response.ok) {
        setSuccessMessage('Avaliação física cadastrada com sucesso!');
        setErrorMessage('');
        setFormData({
          aluno: Number(id),
          peso: '',
          altura: '',
          gordura_corporal: '',
          massa_muscular: '',
          circunferencia_abdominal: '',
        });

        setTimeout(() => router.push(`/alunos/${id}/`), 1000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'Erro ao cadastrar avaliação física.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar avaliação física:', error);
      setErrorMessage('Erro ao cadastrar avaliação física. Por favor, tente novamente.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Cadastrar Avaliação Física</h1>

      {successMessage && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="peso" className="block text-sm font-medium text-gray-700">
            Peso (kg)
          </label>
          <input
            type="number"
            id="peso"
            name="peso"
            value={formData.peso}
            onChange={handleInputChange}
            required
            step="0.01"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="altura" className="block text-sm font-medium text-gray-700">
            Altura (m)
          </label>
          <input
            type="number"
            id="altura"
            name="altura"
            value={formData.altura}
            onChange={handleInputChange}
            required
            step="0.01"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="gordura_corporal" className="block text-sm font-medium text-gray-700">
            Gordura Corporal (%)
          </label>
          <input
            type="number"
            id="gordura_corporal"
            name="gordura_corporal"
            value={formData.gordura_corporal}
            onChange={handleInputChange}
            step="0.1"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="massa_muscular" className="block text-sm font-medium text-gray-700">
            Massa Muscular (kg)
          </label>
          <input
            type="number"
            id="massa_muscular"
            name="massa_muscular"
            value={formData.massa_muscular}
            onChange={handleInputChange}
            step="0.1"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="circunferencia_abdominal" className="block text-sm font-medium text-gray-700">
            Circunferência Abdominal (cm)
          </label>
          <input
            type="number"
            id="circunferencia_abdominal"
            name="circunferencia_abdominal"
            value={formData.circunferencia_abdominal}
            onChange={handleInputChange}
            step="0.1"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
