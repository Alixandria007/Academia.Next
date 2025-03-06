'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiUrl } from '@/utils/imports';
import { formatCPF, formatDate, formatPhone } from '@/utils/formatações';

interface Aluno {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  telefone: string;
}

interface Assinatura {
  id: number;
  aluno: Aluno;
  data_assinatura: string;
  vencimento: string;
}

export default function InscricaoAula() {
  const { id: aulaId } = useParams();
  const router = useRouter();

  const [alunos, setAlunos] = useState<Assinatura[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Assinatura[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Assinatura | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [tipoAtividadeId, setTipoAtividadeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTipoAtividade = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl()}/aula/${aulaId}/`, { credentials: 'include' });
      if (!response.ok) throw new Error('Erro ao carregar o tipo de atividade.');

      const data = await response.json();
      setTipoAtividadeId(data.tipo_atividade.id);
    } catch (error) {
      setErrorMessage((error as Error).message);
      console.error(error);
    }
  }, [aulaId]);

  const fetchAlunos = useCallback(async () => {
    if (!tipoAtividadeId) return;
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl()}/plano/assinatura/?tipo_atividade=${tipoAtividadeId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Erro ao carregar a lista de alunos.');

      const data = await response.json();
      setAlunos(data);
      setFilteredAlunos(data);
    } catch (error) {
      setErrorMessage((error as Error).message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [tipoAtividadeId]);

  useEffect(() => {
    if (aulaId) fetchTipoAtividade();
  }, [aulaId, fetchTipoAtividade]);

  useEffect(() => {
    fetchAlunos();
  }, [tipoAtividadeId, fetchAlunos]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = alunos.filter((associacao) =>
      `${associacao.aluno.first_name} ${associacao.aluno.last_name}`.toLowerCase().includes(term) ||
      associacao.aluno.email.toLowerCase().includes(term)
    );

    setFilteredAlunos(filtered);
  };

  const handleInscricao = async () => {
    if (!selectedAluno) {
      alert('Por favor, selecione um aluno para realizar a inscrição.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl()}/aula/inscricao/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assinatura: selectedAluno.id, aula: aulaId }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro desconhecido.');
      }

      setSuccessMessage('Inscrição realizada com sucesso!');
      setErrorMessage('');
      router.push(`/aula/${aulaId}`);
    } catch (error) {
      setErrorMessage((error as Error).message);
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📚 Inscrição na Aula</h1>

      {errorMessage && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg text-center">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg text-center">{successMessage}</div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar aluno por nome ou e-mail"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-4 border rounded-lg focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Carregando alunos...</p>
      ) : (
        <ul className="space-y-4">
          {filteredAlunos.length > 0 ? (
            filteredAlunos.map((associacao) => (
              <li
                key={associacao.id}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedAluno?.id === associacao.id
                    ? 'bg-blue-100 border-blue-500'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedAluno(associacao)}
              >
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">
                    {associacao.aluno.first_name} {associacao.aluno.last_name}
                  </span>
                  <span>{associacao.aluno.email}</span>
                </div>
                {selectedAluno?.id === associacao.id && (
                  <div className="mt-4">
                    <p><strong>CPF:</strong> {formatCPF(selectedAluno.aluno.cpf)}</p>
                    <p><strong>Telefone:</strong> {formatPhone(selectedAluno.aluno.telefone)}</p>
                    <p><strong>Data de Assinatura:</strong> {formatDate(selectedAluno.data_assinatura)}</p>
                    <p><strong>Vencimento:</strong> {formatDate(selectedAluno.vencimento)}</p>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Nenhum aluno encontrado.</p>
          )}
        </ul>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleInscricao}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          ✅ Confirmar Inscrição
        </button>
        <button
          onClick={() => router.push(`/aulas/${aulaId}`)}
          className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          🔙 Voltar
        </button>
      </div>
    </div>
  );
}
