'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Consultar from '@/components/Consultas';
import ConfirmScreen from '@/components/ConfirmScreen';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { formatMoney } from '@/utils/formatações';

interface Plano {
  id: number;
  nome: string;
  valor: number;
  duracao: string;
}

export default function PlanosConsulta() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [onConfirmScreen, setOnConfirmScreen] = useState<boolean>(false);
  const [selectedPlanoId, setSelectedPlanoId] = useState<number | null>(null);

  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    if (!API) {
      setErrorMessage('Erro: API não definida.');
      setIsLoading(false);
      return;
    }

    const fetchPlanos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API}/plano/`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setPlanos(data);
        } else {
          setErrorMessage('Erro ao carregar os planos.');
        }
      } catch (error) {
        setErrorMessage('Erro ao carregar os planos.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanos();
  }, [API]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const formatDuracao = (value: string) => {
    return value === 'Men' ? 'Mensal' : value === 'Tri' ? 'Trimestral' : value === 'Sem' ? 'Semestral' : 'Anual'
  }

  const headers: { key: keyof Plano; label: string; href?: boolean; format?: Function }[] = [
    { key: 'id', label: 'ID', href: true },
    { key: 'nome', label: 'Nome' },
    { key: 'duracao', label: 'Duração', format: formatDuracao  },
    { key: 'valor', label: 'Valor', format: formatMoney },
  ];

  const filterPlanos = (plano: Plano, searchTerm: string) => {
    return (
      plano.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plano.duracao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plano.valor.toString().includes(searchTerm)
    );
  };

  const handleEdit = (id: number) => {
    router.push(`/planos/${id}/atualizar`);
  };

  const handleDelete = async () => {
    if (!selectedPlanoId) return;

    try {
      const response = await fetch(`${API}/plano/${selectedPlanoId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setPlanos(planos.filter((plano) => plano.id !== selectedPlanoId));
      } else {
        console.error('Erro ao excluir o plano.');
      }
    } catch (error) {
      console.error('Erro ao excluir o plano:', error);
    } finally {
      setOnConfirmScreen(false);
      setSelectedPlanoId(null);
    }
  };

  if (isLoading) return <p className="text-center mt-6">Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {errorMessage && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 text-center rounded">
          {errorMessage}
        </div>
      )}

      <Consultar
        data={planos}
        title="Consultar Planos"
        headers={headers}
        filterFunction={filterPlanos}
        placeholder="Buscar por nome ou duração"
        url_add="cadastrar"
        actions={(item: Plano) => (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handleEdit(item.id)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FiEdit />
            </button>
            <button
              onClick={() => {
                setSelectedPlanoId(item.id);
                setOnConfirmScreen(true);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      />

      {onConfirmScreen && (
        <ConfirmScreen
          onConfirm={handleDelete}
          onClose={() => setOnConfirmScreen(false)}
        />
      )}
    </div>
  );
}
