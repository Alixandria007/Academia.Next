'use client';

import React, { useEffect, useState } from 'react';
import Consultar from '@/components/Consultas';

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <Consultar
        data={funcionarios || []}
        title='Consultar Funcionarios'
        headers={headers}
        filterFunction={filterFuncionarios}
        placeholder="Buscar por nome ou cpf"
      />
    </div>
  );
};

export default ConsultarAlunos;
