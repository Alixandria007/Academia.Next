'use client';

import React, { useEffect, useState } from 'react';
import Consultar from '@/components/Consultas';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import ConfirmScreen from '@/components/ConfirmScreen';

interface Aula {
  id: number;
  nome: string;
  vagas: number;
  horario_inicial: string;
  horario_final: string;
  instrutor: { id: number; first_name: string; last_name: string; foto?: string };
}

const ConsultarAulas: React.FC = () => {
  const [aulas, setAulas] = useState<Aula[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [onConfirmScreen, setOnConfirmScreen] = useState<boolean>(false);
  const [selectedAulaId, setSelectedAulaId] = useState<number | null>(null);
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  useEffect(() => {
    const fetchAulas = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API}/aula/`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setAulas(data);
        } else {
          console.error('Erro ao carregar aulas:', data.detail);
        }
      } catch (error) {
        console.error('Erro ao carregar aulas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAulas();
  }, []);

  const headers: { key: keyof Aula; label: string; href?: boolean }[] = [
    { key: 'id', label: 'ID', href: true },
    { key: 'nome', label: 'Nome' },
    { key: 'horario_inicial', label: 'Início' },
    { key: 'horario_final', label: 'Fim' },
    { key: 'vagas', label: 'Vagas' },
  ];

  const filterAulas = (aula: Aula, searchTerm: string) => {
    return (
      aula.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.instrutor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.instrutor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.horario_inicial.includes(searchTerm) ||
      aula.horario_final.includes(searchTerm)
    );
  };

  const handleEdit = (id: number) => {
    router.push(`/aulas/${id}/atualizar`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API}/aula/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setAulas(aulas?.filter((aula) => aula.id !== id) || null);
      } else {
        console.error('Erro ao excluir a aula.');
      }
    } catch (error) {
      console.error('Erro ao excluir a aula:', error);
    } finally {
      setOnConfirmScreen(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Consultar
        data={aulas || []}
        title="Consultar Aulas"
        headers={headers}
        filterFunction={filterAulas}
        placeholder="Buscar por nome, instrutor ou horário"
        url_add="cadastrar"
        actions={(item: Aula) => (
          <div className="flex justify-center items-center space-x-2">
            <button onClick={() => handleEdit(item.id)} className="text-blue-500 hover:text-blue-700">
              <FiEdit />
            </button>
            <button onClick={() => { setSelectedAulaId(item.id); setOnConfirmScreen(true); }} className="text-red-500 hover:text-red-700">
              <FiTrash2 />
            </button>
          </div>
        )}
      />

      {onConfirmScreen && (
        <ConfirmScreen
          onConfirm={() => handleDelete(Number(selectedAulaId))}
          onClose={() => setOnConfirmScreen(false)}
        />
      )}
    </div>
  );
};

export default ConsultarAulas;
