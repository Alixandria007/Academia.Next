'use client';

import { apiUrl } from '@/utils/imports';
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa'; // Importando ícone de lixo para o botão de excluir

interface Inscricao {
  id: number;
  aluno: {
    first_name: string;
    last_name: string;
    email: string;
  };
  data_inscricao: string;
}

const Inscricoes = ({ data }: { data: Inscricao[] }) => {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>(data || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleDelete = async (inscricaoId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta inscrição?')) {
      return; // Não faz nada se o usuário cancelar a exclusão
    }

    try {
      const response = await fetch(`${apiUrl()}/aula/inscricao/${inscricaoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setInscricoes(inscricoes.filter((inscricao) => inscricao.id !== inscricaoId));
        alert(data.success);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Erro ao excluir inscrição');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 max-w-5xl mx-auto my-6">
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
                    {inscricao.aluno.first_name} {inscricao.aluno.last_name}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Email:</strong> {inscricao.aluno.email}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <strong>Data de Inscrição:</strong> {new Date(inscricao.data_inscricao).toLocaleDateString()}
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
