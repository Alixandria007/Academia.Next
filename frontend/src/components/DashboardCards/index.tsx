import React from 'react';

type Dashboard = {
  alunos: number
  instrutores: number
  aulas: number
  planos: number
}
const DashboardCards = ({alunos, instrutores, aulas, planos}: Dashboard ) => {
  const stats = [
    { label: 'Alunos Ativos', value: alunos },
    { label: 'Instrutores', value: instrutores },
    { label: 'Aulas Semanais', value: aulas },
    { label: 'Planos Ativos', value: planos }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-gray-700 text-4x1">{stat.label}</h3>
          <p className="text-4xl font-semibold text-indigo-600">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
