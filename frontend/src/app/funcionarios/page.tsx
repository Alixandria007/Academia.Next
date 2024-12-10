'use client';

import React, { useEffect, useState } from 'react';
import Consultar from '@/components/Consultas';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Funcionarios {
  id: number;
  first_name: string;
  last_name: string;
  cpf: string;
  telefone: string | null;
  data_de_nascimento: string | null;
  ativo: boolean;
  responsavel: number | null;
}

const ConsultarAlunos: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionarios[] | null>(null)
  const router = useRouter()
  
  useEffect(() => {
    const FetchFuncionarios: Function = async () => {
      const response = await fetch('http://127.0.0.1:8000/funcionario')
      const data: Funcionarios[] = await response.json()

      setFuncionarios(data)
    }

    FetchFuncionarios()
  }, [])

  const headers: { key: keyof Funcionarios; label: string; href?: boolean }[] = [
    { key: 'id', label: 'ID', href: true },
    { key: 'first_name', label: 'Nome' },
    { key: 'last_name', label: 'Sobrenome' },
    { key: 'cpf', label: 'CPF' },
  ];

  const filterFuncionarios = (funcionarios: Funcionarios, searchTerm: string) => {
    return (
      funcionarios.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionarios.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionarios.cpf.includes(searchTerm)
    );
  };

  const handleEdit = (id: number) => {
    router.push(`funcionarios/${id}/atualizar`)
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/funcionario/${id}/`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Aluno excluído com sucesso!');
          setFuncionarios(funcionarios?.filter((funcionario) => funcionario.id !== id) || null);
        } else {
          alert('Erro ao excluir o aluno.');
        }
      } catch (error) {
        console.error('Erro ao excluir o aluno:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <Consultar
        data={funcionarios || []}
        title='Consultar Funcionarios'
        headers={headers}
        filterFunction={filterFuncionarios}
        placeholder="Buscar por nome ou cpf"
        actions={(item: Funcionarios) => (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handleEdit(item.id)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FiEdit />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>)}
      />
    </div>
  );
};

export default ConsultarAlunos;
