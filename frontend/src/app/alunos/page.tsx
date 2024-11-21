'use client';

import React from 'react';
import Consultar from '@/components/Consultas'; // Importando o componente Consultar

interface Aluno {
  id: number;
  matricula: string;
  nome: string;
  turma: string;
}

const ConsultarAlunos: React.FC = () => {

  const alunos: Aluno[] = [
    { id: 1, matricula: '2023001', nome: 'João Silva', turma: '6º A' },
    { id: 2, matricula: '2023002', nome: 'Maria Oliveira', turma: '7º B' },
    { id: 3, matricula: '2023003', nome: 'Pedro Costa', turma: '8º C' },
    { id: 4, matricula: '2023004', nome: 'Ana Santos', turma: '9º A' },
  ];

  const headers: { key: keyof Aluno; label: string }[] = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'nome', label: 'Nome' },
    { key: 'turma', label: 'Turma' },
  ];

  const filterAlunos = (aluno: Aluno, searchTerm: string) => {
    return (
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.includes(searchTerm)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <Consultar
        data={alunos}
        title='Consultar Alunos'
        headers={headers}
        filterFunction={filterAlunos}
        placeholder="Buscar por nome ou matrícula"
      />
    </div>
  );
};

export default ConsultarAlunos;
