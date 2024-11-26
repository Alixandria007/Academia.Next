'use client';

import React, { useEffect, useState } from 'react';
import Consultar from '@/components/Consultas';

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
  const [alunos, setAlunos] = useState<Aluno[] | null>(null)
  
  useEffect(() => {
    const FetchAlunos: Function = async () => {
      const response = await fetch('http://127.0.0.1:8000/aluno')
      const data: Aluno[] = await response.json()

      setAlunos(data)
    }

    FetchAlunos()
  }, [])

  const headers: { key: keyof Aluno; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'first_name', label: 'Nome' },
    { key: 'last_name', label: 'Sobrenome' },
    { key: 'cpf', label: 'CPF' },
  ];

  const filterAlunos = (aluno: Aluno, searchTerm: string) => {
    return (
      aluno.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.cpf.includes(searchTerm)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <Consultar
        data={alunos || []}
        title='Consultar Alunos'
        headers={headers}
        filterFunction={filterAlunos}
        placeholder="Buscar por nome ou matrícula"
      />
    </div>
  );
};

export default ConsultarAlunos;
