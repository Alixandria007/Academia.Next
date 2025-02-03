'use client';

import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
import Consultar from '@/components/Consultas';
import { useRouter } from 'next/navigation';
import ConfirmScreen from '@/components/ConfirmScreen';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [onConfirmScreen, setOnConfirmScreen] = useState<boolean>(false)
  const [selectedAlunoId, setSelectedAlunoId] = useState<number | null>(null);
  const router = useRouter()
  
  useEffect(() => {
    const FetchAlunos: Function = async () => {
      setIsLoading(true)
      try{
        const response = await fetch('http://127.0.0.1:8000/aluno',{
          credentials: 'include',
          headers:{
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();

        if(response.ok){
            setAlunos(data);
        }

        else{
          console.error(data.detail)
        }
      }

      catch(error){
        console.error(error)
      }

      finally{
        setIsLoading(false)
      }
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
      try {
        const response = await fetch(`http://127.0.0.1:8000/aluno/${id}/`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.status) {
          router.refresh()
          setAlunos(alunos?.filter((aluno) => aluno.id !== id) || null);
        } else {
        }
      } catch (error) {
        console.error('Erro ao excluir o aluno:', error);
      }
  };

  if (isLoading) {return null}

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
              id={String(item.id)}
              onClick={() => {setSelectedAlunoId(item.id); setOnConfirmScreen(true)}}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      />


      {
        onConfirmScreen && (
          <ConfirmScreen
          onConfirm={() => handleDelete(Number(selectedAlunoId))} 
          onClose={() => setOnConfirmScreen(false)}
          />
        )
      }
    </div>
  );
};

export default ConsultarAlunos;
