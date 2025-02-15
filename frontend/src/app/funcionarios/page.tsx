'use client';

import React, { useEffect, useState } from 'react';
import Consultar from '@/components/Consultas';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import ConfirmScreen from '@/components/ConfirmScreen';
import { formatPhone } from '@/utils/formatações';

interface Funcionarios {
  id: number;
  first_name: string;
  last_name: string;
  cpf: string;
  telefone: string | null;
  cref?: string | null
}

const ConsultarFuncionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionarios[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [onConfirmScreen, setOnConfirmScreen] = useState<boolean>(false)
  const [selectedAlunoId, setSelectedAlunoId] = useState<number | null>(null);
  const API = process.env.NEXT_PUBLIC_API
  const router = useRouter()
  
    useEffect(() => {
      const FetchFuncionarios: Function = async () => {
        setIsLoading(true)
        try{
          const response = await fetch(`${API}/funcionario/?cref_boolean=True`,{
            headers:{
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });
          const data = await response.json();
  
          if(response.ok){
              setFuncionarios(data);
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
  
      FetchFuncionarios();
    }, []);

  const headers: { key: keyof Funcionarios; key2?: keyof Funcionarios; label: string; href?: boolean, format?: Function }[] = [
    { key: 'id', label: 'ID', href: true },
    { key: 'first_name', key2: 'last_name', label: 'Nome Completo' },
    { key: 'telefone', label: 'Telefone', format: formatPhone },
    { key: 'cref', label: 'Instrutor'}
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
      try {
        const response = await fetch(`${API}/funcionario/${id}/`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          setFuncionarios(funcionarios?.filter((funcionario) => funcionario.id !== id) || null);
        } else {
          console.log('Erro ao excluir o aluno.');
        }
      } catch (error) {
        console.error('Erro ao excluir o aluno:', error);
      }
      finally{
        setOnConfirmScreen(false)
      }
  };

  if (isLoading) {return null}

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <Consultar
        data={funcionarios || []}
        title='Consultar Funcionarios'
        headers={headers}
        filterFunction={filterFuncionarios}
        placeholder="Buscar por nome ou cpf"
        url_add = 'cadastrar'
        actions={(item: Funcionarios) => (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handleEdit(item.id)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FiEdit />
            </button>
            <button
              onClick={() => {setSelectedAlunoId(item.id); setOnConfirmScreen(true)}}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>)}
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

export default ConsultarFuncionarios;
