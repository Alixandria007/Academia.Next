'use client';

import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
import Consultar from '@/components/Consultas';
import { useRouter } from 'next/navigation';

interface Aluno {
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
  const [alunos, setAlunos] = useState<Aluno[] | null>(null);
  const router = useRouter()
  
  useEffect(() => {
    const FetchAlunos: Function = async () => {
      const response = await fetch('http://127.0.0.1:8000/aluno');
      const data: Aluno[] = await response.json();

      setAlunos(data);
    };

    FetchAlunos();
  }, []);

  const headers: { key: keyof Aluno; label: string; href?: boolean }[] = [
    { key: 'id', label: 'ID', href: true },
    { key: 'first_name', label: 'Nome' },
    { key: 'last_name', label: 'Sobrenome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'ativo', label: 'Status' },
  ];

  const filterAlunos = (aluno: Aluno, searchTerm: string) => {
    return (
      aluno.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.cpf.includes(searchTerm)
    );
  };

  const handleEdit = (id: number) => {
    router.push(`alunos/${id}/atualizar`)
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/aluno/${id}/`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Aluno excluído com sucesso!');
          setAlunos(alunos?.filter((aluno) => aluno.id !== id) || null);
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
        data={alunos || []}
        title="Consultar Alunos"
        headers={headers}
        filterFunction={filterAlunos}
        placeholder="Buscar por nome ou matrícula"
        actions={(item: Aluno) => (
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
          </div>
        )}
      />
    </div>
  );
};

export default ConsultarAlunos;
