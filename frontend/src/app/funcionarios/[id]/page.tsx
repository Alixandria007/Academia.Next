'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatarCREF, formatCPF, formatDate, formatMoney, formatPhone, formatTime } from '@/utils/formatações';
import Link from 'next/link';

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

interface Aula {
  id: number;
  nome: string;
  alunos_inscritos: number;
  horario_inicial: string;
  horario_final: string;
  dias_da_semana: {nome:string}[];
}

const DetalhesFuncionario: React.FC = () => {
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL 
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

        if (data.cref) {
          const aulasResponse = await fetch(`${API}/aula/?instrutor_id=${id}`, {
            credentials: 'include',
          });
          if (aulasResponse.ok) {
            const aulasData: Aula[] = await aulasResponse.json();
            setAulas(aulasData);
          }
        }
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
    <>
      <div className="max-w-4xl mx-auto mb-10 p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Detalhes do Funcionário
        </h1>
        <div className="flex flex-col items-center">
          {funcionario.foto ? (
            <img
              src={`${API}/${funcionario.foto}`}
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
            <p><strong>🕒 Horário:</strong> {formatTime(funcionario.entrada)} - {formatTime(funcionario.saida)}</p>
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

      {funcionario.cref && (
        <div className="max-w-4xl mx-auto mb-10 p-8 bg-white shadow-lg rounded-xl">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          🏃‍♂️ Aulas Ministradas
          </h3>
          {aulas.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma aula registrada.</p>
          ) : (
            <ul className="space-y-4">
              {aulas.map((aula) => (
                <li key={aula.id} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300">
                  <p className="text-lg font-medium text-gray-800">
                    <strong>📖 Aula:</strong> <Link href={`${baseUrl}/aulas/${aula.id}`} className='text-blue-600'>{aula.nome}</Link>
                  </p>
                  <p className="text-gray-600">
                    <strong>📅 Dia:</strong>{" "}
                    {aula.dias_da_semana
                      ? aula.dias_da_semana.map(dia => dia.nome).join(', ')
                      : "Não informado"}
                  </p>
                  <p className="text-gray-600"><strong>⏰ Horário:</strong> {`${formatTime(aula.horario_inicial)} - ${formatTime(aula.horario_final)}` }</p>
                  <p className="text-gray-600"><strong>🏋️‍♂️ Alunos:</strong> {aula.alunos_inscritos}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
      );
    };

export default DetalhesFuncionario;
