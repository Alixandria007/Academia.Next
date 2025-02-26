import React from 'react';

type Dashboard = {
  alunos: number;
  instrutores: number;
  aulas: number;
  planos: number;
};

const DashboardCards = ({ alunos, instrutores, aulas, planos }: Dashboard) => {
  const stats = [
    { label: 'Alunos Ativos', value: alunos, icon: '🏋️‍♂️' },
    { label: 'Funcionarios', value: instrutores, icon: '🧑‍🤝‍🧑' },
    { label: 'Aulas Semanais', value: aulas, icon: '🗓️' },
    { label: 'Planos Ativos', value: planos, icon: '📊' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 shadow-lg rounded-lg flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:scale-105">
          <div>
            <h3 className="text-gray-700 text-lg font-semibold">{stat.label}</h3>
            <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
          </div>
          <div className="text-3xl text-indigo-600">{stat.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
