'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatarCREF, formatCPF, formatDate, formatMoney, formatPhone } from '@/utils/formatações';

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
  const API = process.env.NEXT_PUBLIC_API;
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      router.push('/funcionarios');
      return;
    }

    const fetchFuncionario = async () => {
      try {
        const response = await fetch(`${API}/funcionario/${id}/`, {
          credentials: 'include',
        });
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
          credentials: 'include',
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
    return <div className="text-center text-gray-500 mt-10">Carregando...</div>;
  }

  if (!funcionario) {
    return (
      <div className="text-center text-red-500 mt-10">
        Funcionário não encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-10 p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Detalhes do Funcionário
      </h1>
      <div className="flex flex-col items-center">
        {funcionario.foto ? (
          <img
            src={`http://127.0.0.1:8000/${funcionario.foto}`}
            alt={`${funcionario.first_name} ${funcionario.last_name}`}
            className="w-40 h-40 rounded-full mb-6 shadow-md"
          />
        ) : (
          <div className="w-40 h-40 bg-gray-200 rounded-full mb-6 flex items-center justify-center shadow-md">
            <span className="text-gray-500">Sem Foto</span>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-gray-700">
          {funcionario.first_name} {funcionario.last_name}
        </h2>
        <p className="text-gray-500 text-lg mb-6">{funcionario.email}</p>

        <div className="w-full bg-gray-100 p-6 rounded-lg shadow-sm">
          <p><strong>📅 Admissão:</strong> {formatDate(funcionario.data_admissao)}</p>
          <p><strong>🕒 Horário:</strong> {funcionario.entrada} - {funcionario.saida}</p>
          <p><strong>💰 Salário:</strong> {formatMoney(Number(funcionario.salario))}</p>
          <p><strong>🆔 CPF:</strong> {formatCPF(funcionario.cpf)}</p>
          <p><strong>📞 Telefone:</strong> {formatPhone(funcionario.telefone) || 'Não informado'}</p>
          {funcionario.cref && <p><strong>🏅 CREF:</strong> {formatarCREF(funcionario.cref)}</p>}
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handleUpdate}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ✏️ Atualizar
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            🗑 Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesFuncionario;
