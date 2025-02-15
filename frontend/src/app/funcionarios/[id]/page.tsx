'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Funcionario {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  foto?: string | null;
  data_admissao: string;
  entrada: string;
  saida: string;
  salario: string;
  cpf: string;
  telefone?: string | null;
  cref?: string | null;
}

const DetalhesFuncionario: React.FC = () => {
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API
  const { id } = useParams(); 

  useEffect(() => {
    if (!id) {
      router.push('/funcionarios');
      return;
    }

    const fetchFuncionario = async () => {
      try {
        const response = await fetch(`${API}/funcionario/${id}/`,{
          credentials:'include'
        }
        );
        if (!response.ok) throw new Error('Erro ao buscar detalhes do funcionário');
        const data: Funcionario = await response.json();
        setFuncionario(data);
      } catch (error) {
        console.error('Erro ao carregar os detalhes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionario();
  }, [id, router]);

  const handleUpdate = () => {
    router.push(`/funcionarios/${id}/atualizar`);
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        const response = await fetch(`${API}/funcionario/${id}/`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Funcionário excluído com sucesso!');
          router.push('/funcionarios'); 
        } else {
          alert('Erro ao excluir o funcionário.');
        }
      } catch (error) {
        console.error('Erro ao excluir o funcionário:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Carregando...</div>;
  }

  if (!funcionario) {
    return (
      <div className="text-center text-red-500">
        Funcionário não encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-6 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Detalhes do Funcionário</h1>
      <div className="flex flex-col items-center">
        {funcionario.foto ? (
          <img
            src={`http://127.0.0.1:8000/${funcionario.foto}`}
            alt={`${funcionario.first_name} ${funcionario.last_name}`}
            className="w-36 h-36 rounded-full mb-4"
          />
        ) : (
          <div className="w-36 h-36 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            <span className="text-gray-500">Sem Foto</span>
          </div>
        )}
        <h2 className="text-xl font-semibold">
          {funcionario.first_name} {funcionario.last_name}
        </h2>
        <p className="text-gray-600 mb-4">{funcionario.email}</p>
        <div className="w-full">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Data de Admissão:</span>
            <span>{funcionario.data_admissao}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Horário de Trabalho:</span>
            <span>
              {funcionario.entrada} - {funcionario.saida}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Salário:</span>
            <span>R$ {parseFloat(funcionario.salario).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">CPF:</span>
            <span>{funcionario.cpf}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Telefone:</span>
            <span>{funcionario.telefone || 'Não informado'}</span>
          </div>
          {funcionario.cref && (
            <div className="flex justify-between mb-2">
              <span className="font-medium">CREF:</span>
              <span>{funcionario.cref}</span>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Atualizar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesFuncionario;
