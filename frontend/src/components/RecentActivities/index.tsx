import React from 'react';

const RecentActivities = () => {
  const activities = [
    { aluno: 'João Silva', atividade: 'Check-in', data: '15/11/2024' },
    { aluno: 'Maria Souza', atividade: 'Aula de Spinning', data: '14/11/2024' },
    { aluno: 'Carlos Pereira', atividade: 'Plano Renovado', data: '13/11/2024' },
  ];

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold text-gray-700">Atividades Recentes</h2>
      <ul>
        {activities.map((act, index) => (
          <li key={index} className="border-b py-2">
            <span className="font-semibold">{act.aluno}</span> - {act.atividade} em {act.data}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
