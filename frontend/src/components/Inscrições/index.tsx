'use client';

import { apiUrl } from '@/utils/imports';
import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

interface Assinatura {
  id: number;
  total: number;
  data_assinatura: string;
  vencimento: string;
  aluno: number; // Apenas o ID do aluno
  plano: number;
}

interface Inscricao {
  id: number;
  assinatura: Assinatura;
  data_inscricao: string;
  aula: number;
}

const Inscricoes = ({ data }: { data: Inscricao[] }) => {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>(data || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Função para excluir uma inscrição
  const handleDelete = async (inscricaoId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta inscrição?')) {
      return; // Cancela a exclusão se o usuário não confirmar
    }

    try {
      const response = await fetch(`${apiUrl()}/aula/inscricao/${inscricaoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setInscricoes(inscricoes.filter((inscricao) => inscricao.id !== inscricaoId));
        alert(data.success || 'Inscrição excluída com sucesso!');
      } else {
        alert(data.error || 'Erro ao excluir inscrição.');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-3xl border border-gray-200">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Inscrições</h2>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500"></div>
        </div>
      )}

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {inscricoes.length > 0 ? (
        <ul className="space-y-6">
          {inscricoes.map((inscricao) => (
            <li
              key={inscricao.id}
              className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-semibold text-gray-800">
                    Aluno ID: {inscricao.assinatura.aluno}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Data da Assinatura:</strong>{' '}
                    {new Date(inscricao.assinatura.data_assinatura).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <strong>Vencimento:</strong>{' '}
                    {new Date(inscricao.assinatura.vencimento).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <strong>Data de Inscrição:</strong>{' '}
                    {new Date(inscricao.data_inscricao).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <strong>Plano:</strong> {inscricao.assinatura.plano}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(inscricao.id)}
                  className="ml-4 p-3 bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">Nenhuma inscrição encontrada.</p>
      )}
    </div>
  );
};

export default Inscricoes;
